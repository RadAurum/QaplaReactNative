import React from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as RNIap from 'react-native-iap';
import { GiphySDK } from '@giphy/react-native-sdk';

import Router from './src/Router';
import { auth, notifications } from './src/utilities/firebase';
import store from './src/store/store';
import Snackbar from './src/components/Snackbar/Snackbar';
import UpdateApp from './src/components/UpdateApp/UpdateApp';
import { translate } from './src/utilities/i18';

import {
    verLocalVersion,
    verServerVersion,
    verShouldUpdateApp
} from './src/utilities/version';

import {
  dbRemoveAppVersionValueListener,
  dbEnableAppVersionValueListener,
  purchaseAttempt,
  listenToPurchaseCompleted,
  removeListenerToPurchaseCompleted
} from './src/services/database';
import { handleInAppPurchases } from './src/services/functions';

import {
    trackOnSegment
} from './src/services/statistics';
import FinishingBuyTransactionModal from './src/components/FinishingBuyTransactionModal/FinishingBuyTransactionModal';

console.disableYellowBox = true;

const apiKey = Platform.select({ ios: 'rzkRmwwKiG7ORdkorEeZaQYWtEH0Rc1R', android: 's9vO5AnXWPBJC4FYQJ8li4Hu4g5NbGio' });
GiphySDK.configure({ apiKey });

class App extends React.Component {
    state = {
        openSnackbar: false,
        snackbarMessage: '',
        timerOnSnackBar: false,
        snackbarAction: null,
        snackbarActionMessage: '',
        navigateTo: '',
        closeSnackBar: false,
        updateRequired: false,
        openTransactionModal: false,
        transactionProgress: 0,
        transactionText: ''
    };

    purchaseUpdateSubscription = null;
    purchaseErrorSubscription = null;

    componentDidMount() {
        this.inAppPurchasesListeners();
        this.enableNotificationListeners();
        dbEnableAppVersionValueListener(this.checkAppUpdates);
        this.checkAppUpdates();
    }

    componentWillUnmount() {
        /**
         * Usually call a subscriber in this way in the componentWillUnmount event
         * means that we are removing that listener, in this case we are doing that
         */
        this.notificationListener();

        RNIap.endConnection();
        this.notificationOpenedListener();
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
          }
          if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
          }

        dbRemoveAppVersionValueListener();
    }

    async inAppPurchasesListeners() {
        try {
            await RNIap.initConnection();
            if (Platform.OS === 'android') {
                await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
            }

            this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
                const receipt = Platform.OS === 'android' ? { transactionId: purchase.transactionId, ...JSON.parse(purchase.transactionReceipt)} : { transactionId: purchase.transactionId, productId: purchase.productId, iOSReceipt: purchase.transactionReceipt };
                if ((Platform.OS === 'android' && receipt && receipt.purchaseState === 0) || Platform.OS === 'ios') {
                    this.setState({ openTransactionModal: true });
                    // Store purchase attempt
                    await purchaseAttempt(auth.currentUser.uid, purchase.transactionId, receipt, Platform.OS);
                    this.setState({ transactionProgress: 0.25, transactionText: translate('App.processingPayment.validating') });

                    // Finish transaction (notify Google/Apple)
                    await RNIap.finishTransaction(purchase, true);
                    this.setState({ transactionProgress: 0.5 });

                    // Validate purchase and distribute Qoins
                    const response = await handleInAppPurchases(receipt, Platform.OS);

                    if (response && response.data && response.data.status) {
                        // Everything is OK
                        if (response.data.status === 200) {
                            /**
                             * We empty transactionText string and then fill it to trick the MaskedView component on android so we can have cool
                             * gradients on the text of the FinishingBuyTransactionModal
                             */
                            this.setState({ transactionProgress: 0.75, transactionText: '' }, () => this.setState({ transactionText: translate('App.processingPayment.deliveringQoins') }));
                            try {
                                listenToPurchaseCompleted(auth.currentUser.uid, purchase.transactionId, (transaction) => {
                                    if (transaction.exists()) {
                                        removeListenerToPurchaseCompleted(auth.currentUser.uid);
                                        this.setState({ transactionProgress: 1, transactionText: '' }, () => this.setState({ transactionText: translate('App.processingPayment.qoinsDelivered') }));
                                        const { onPurchaseFinished } = store.getState().purchasesReducer;
                                        if (onPurchaseFinished) {
                                            onPurchaseFinished();
                                        }

                                        setTimeout(() => {
                                            this.setState({ openTransactionModal: false });
                                        }, 1000);

                                        trackOnSegment('Qoins Purchase Finished');
                                    }
                                });
                            } catch (error) {
                                console.log('Finish transaction Error', error);
                            }
                        // Qoins transaction failed
                        } else if (response.data.status === 500) {
                            console.log('Qoins transaction failed');
                        // Payment could not be verified
                        } else if (response.data.status === 400) {
                            console.log('Payment could not be verified');
                        }
                    // Unknown error
                    }  else {
                        console.log('Unknown error');
                    }
                // Payment pending
                } else if (Platform.OS === 'android' && receipt && receipt.purchaseState === 4) {
                    // Store purchase attempt
                    await purchaseAttempt(auth.currentUser.uid, purchase.transactionId, receipt, Platform.OS);
                    Alert.alert(
                        translate('App.processingPayment.pendingPaymentAlert.title'),
                        translate('App.processingPayment.pendingPaymentAlert.message'),
                        [
                            {
                                text: 'Ok'
                            }
                        ]
                    )
                }
            });

            this.purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Enable listeners for Firebase Cloud Messaging notifications
     */
    enableNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        */
        this.notificationListener = notifications.onNotification((notification) => {
            const { title, body, data } = notification;
            const { navigateTo } = data;

            trackOnSegment('Push Notification Foreground', {
                ScreenToNavigate: navigateTo,
                Title: title,
                Body: body
            });

            /**
             * Shows the SnackBar with the title and body of the notification.
             * If the notification have the navigateTo property we set the action
             * with the forceNavigation function
             */
            this.setState({
                snackbarMessage: `${title} ${body}`,
                timerOnSnackBar: true,
                snackbarAction: navigateTo ? () => this.forceNavigation(navigateTo) : null,
                snackbarActionMessage: navigateTo ? translate('App.snackBar.details') : ''
            });
        });


        /*
        * If the app is in background, we listen for when a notification is opened
        */
        this.notificationOpenedListener = notifications.onNotificationOpened((notificationOpen) => {
            const { title, body, _data } = notificationOpen.notification;
            const { navigateTo } = _data;

            trackOnSegment('Push Notification Background', {
                ScreenToNavigate: navigateTo,
                Title: title,
                Body: body
            });

            if (navigateTo) {
                this.forceNavigation(navigateTo);
            }
        });
    }

    /**
     * Indicates to the router that must navigate to the given screen
     * also close the SnackBar and clean their props
     */
    forceNavigation = (navigateTo) => {
        this.setState({
            navigateTo,
            timerOnSnackBar: false,
            closeSnackBar: true
        }, () =>
            this.setState({
                navigateTo: '',
                snackbarActionMessage: '',
                snackbarAction: null,
                closeSnackBar: false,
                snackbarMessage: ''
            })
        );
    }

    /**
     * Check for app updates by consulting the app version from server
     */
    checkAppUpdates = async () => {
        const localVer = verLocalVersion();
        const remoteVer = await verServerVersion();
        const updateRequired = verShouldUpdateApp(localVer, remoteVer);

        if (updateRequired) {
          this.setState({updateRequired}, dbRemoveAppVersionValueListener);
        }
    }

    render() {
        return (
            <>
                {this.state.updateRequired ?
                    <UpdateApp />
                :
                <SafeAreaProvider>
                	<Router forceNavigation={this.state.navigateTo} />
	                <Snackbar
	                    forceClose={this.state.closeSnackBar}
	                    visible={this.state.openSnackbar}
	                    message={this.state.snackbarMessage}
	                    openAndCollapse={this.state.timerOnSnackBar}
	                    action={this.state.snackbarAction}
	                    actionMessage={this.state.snackbarActionMessage} />
                    <FinishingBuyTransactionModal open={this.state.openTransactionModal}
                        transactionProgress={this.state.transactionProgress}
                        transactionText={this.state.transactionText} />
                </SafeAreaProvider>
              }
          </>
        )
    }
}

const AppReduxContainer = () => (
  <Provider store={store}>
      <StatusBar backgroundColor='#0e1222' />
      <App />
  </Provider>
);

export default AppReduxContainer;
