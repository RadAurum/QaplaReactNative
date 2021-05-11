// Facebook button on line 1966

import React, { Component } from 'react';
import { BackHandler, View, Image, SafeAreaView, Platform, Modal, Text, TouchableOpacity, Dimensions, TextInput, Keyboard, Animated, Easing, LayoutAnimation } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx, paddingTopForAndroidDevicesWithNotch, getScreenSizeMultiplier, getScreenWidth, getScreenHeight } from '../../utilities/iosAndroidDim';
import { connect } from 'react-redux';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../utilities/Colors';
import styles from './style';
import Images from '../../../assets/images';
import { signInWithFacebook, setupGoogleSignin, signInWithGoogle, signInWithApple } from '../../services/auth';
import { translate } from '../../utilities/i18';
import { updateUserLoggedStatus, userHaveTwitchId, validateUserName, createUserProfile } from '../../services/database';
import { subscribeUserToAllRegistredTopics } from '../../services/messaging';
import ProgressDotsIndicator from '../../components/ProgressDotsIndicator/ProgressDotsIndicator';
import CheckBox from '../../components/CheckBox/CheckBox';
import PrivacyModal from '../../components/PrivacyModal/PrivacyModal';
import TermsAndConditionsModal from '../../components/TermsAndConditionsModal/TermsAndConditionsModal';

const QaplaSignUpLogo2021 = Images.png.qaplaSignupLogo2021.img;
const AwesomeHand = Images.png.awesomeHand.img;
const FacebookIcon = Images.svg.facebookIcon;
const GoogleIcon = Images.svg.googleIcon;
const AppleIcon = Images.svg.appleIcon;
const TwitchIcon = Images.svg.twitchIcon;
const LeftArrowThiccIcon = Images.svg.leftArrowThiccIcon;
const CloseThiccIcon = Images.svg.closeThiccIcon;
const TwitchExtrudedLogo = Images.svg.twitchExtrudedLogo;
const AlertIcon = Images.svg.alertIcon;


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const DismissKeyboardTouch = (props) => {
    return (
        <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
            onPress={props.onPress} />
    );
};

class SignUpLoginHandlerScreen extends Component {
    state = {
        originScreenWhenComponentMounted: 'Achievements',
        steps: 3,
        step: 0,
        prevScreen: '',
        actualScreen: 'init',
        nextScreen: '',
        keyboardIsActive: false,
        username: '',
        email: '',
        streamer: '',
        checkingUserName: false,
        showErrorMessage: false,
        agreementTermsState: false,
        agreementPrivacyState: false,
        gradientTo: 0,
        disableCornerButton: false,
        openTermsModal: false,
        openPrivacyModal: false,

        closeBackButtonIconPosition: new Animated.Value(0),
        closeBackButtonIconWidth: new Animated.Value(40),
        closeBackButtonIconOpacity: new Animated.Value(1),
        closeBackButtonIconMarginLeft: new Animated.Value(0),
        closeBackButtonIconPositionAnimationDuration: 400,

        signUpLogInButtonsHexColorController: new Animated.Value(0),

        linearGradientColor1: '#A716EE',

        linearGradientPositionController: new Animated.Value(0),

        linearGradientContrainerYPositionController: new Animated.Value(0),

        button1Color: Colors.greenQapla,
        button2Color: '#3b4bf9',

        titleXPositionController: new Animated.Value(0),
        signUpLogInButtonsContentXPositionController: new Animated.Value(0),

        bodyTextUsernameInputXPositionController: new Animated.Value(0),
        topButtonXPosition: new Animated.Value(0),
        bottomButtonXPosition: new Animated.Value(0),

        qaplaLogoYPositionController: new Animated.Value(0),

        twitchLogoXPositionController: new Animated.Value(0),

        twitchLinkTitleXPositionController: new Animated.Value(0),
        twitchLinkSubtitleXPositionController: new Animated.Value(0),
        twitchLinkBodyXPositionController: new Animated.Value(0),
        twitchLinkButtonXPositionController: new Animated.Value(0),

        awesomeHandYPositionController: new Animated.Value(0),
        succesfulRegisterTitleYPositionController: new Animated.Value(0),
        succesfulRegisterBodyYPositionController: new Animated.Value(0),
        succesfulRegisterButtonYPositionController: new Animated.Value(0),
        succesfulRegisterTutorialYPositionController: new Animated.Value(0),

        agreementsController: new Animated.Value(0),

        facebookButtonXPosition: new Animated.Value(0),
    };

    titles = {
        init: '¡Bienvenido!',
        signUp: 'Crea tu cuenta',
        logIn: 'Inicia sesión',
        twitchLink: 'Vincula tu cuenta',
        twitchWarning: 'Importante',
        createUsername: 'Crea tu nombre de usuario',
    }
    subtitles = {
        twitchLink: '¡Tu progreso en tiempo real!',
        twitchWarning: 'Te recordamos que las cuentas no vinculadas con Twitch no podrán recibir sus canjes del canal 😭 ',
    }
    bodies = {
        init: 'Crea una cuenta o inicia sesión para unirte a los streams 🥳',
        signUp: 'Descubre tu primer stream ¡ahora!\n',
        logIn: '¡Bienvenido de vuelta!\nTe extrañamos 😎\n',
        twitchLink: 'Recibe tus Qoins y XQ automáticamente al canjear puntos del canal de tu streamer.',
        twitchWarning: 'Pero no te preocupes, siempre puedes vincular tu cuenta desde tu perfil 😉',
    }

    gradientColors = {
        normalA: '#A716EE',
        normalB: '#2C07FA',
        warningA: '#FA8A07',
        warningB: '#EE1661',
        registered: '#202560',
    }

    buttonsColors = {
        signUp: Colors.greenQapla,
        logIn: '#3b4bf9',
        apple: '#000000',
        google: '#FFFFFF',
        twitch: '#9146FF',
    }

    componentDidMount() {
        setupGoogleSignin();

        /**
         * When the component is recently mounted (and because we are changing from a stack navigator to the switch navigator)
         * the currentScreen prop contains the Id of the last screen visited befor this one, we save this data on the state
         * so we can know the true origin, and we can handle the logic of the user switching between social media sign in
         * and email login
         */
        // this.setState({ actualScreen: 'init' });
        this.setState({ originScreenWhenComponentMounted: this.props.currentScreen, streamer: this.props.navigation.state.params ? this.props.navigation.state.params.streamer : '' });
        this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
        this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    }

    componentWillUnmount() {
        this.backHandlerListener.remove();
        this.keyboardShowListener.remove();
        this.keyboardHideListener.remove();
    }

    keyboardDidShow = () => {
        this.setState({ keyboardIsActive: true });
    }

    keyboardDidHide = () => {
        this.setState({ keyboardIsActive: false });
        if (this.usernameInput) {
            this.usernameInput.blur();
        }
    }

    /**
     * Check to what screen must be redirected the user if presses the back button (only apply to android)
     */
    handleAndroidBackButton = () => {
        if (this.state.actualScreen === 'signUp' || this.state.actualScreen === 'logIn') {
            Animated.timing(this.state.closeBackButtonIconPosition, {
                toValue: 0,
                duration: this.state.closeBackButtonIconPositionAnimationDuration,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.signUpLogInButtonsHexColorController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.signUpLogInButtonsContentXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.topButtonXPosition, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.facebookButtonXPosition, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.titleXPositionController, {
                toValue: -1,
                duration: this.state.closeBackButtonIconPositionAnimationDuration,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start(() => {
                setTimeout(() => {
                    this.setState({
                        prevScreen: '',
                        actualScreen: 'init',
                    });
                    this.state.titleXPositionController.setValue(0);
                    this.setState({
                        nextScreen: '',
                    });
                }, 100);
            });
            return true;
        }
        if (this.state.actualScreen === 'createUsername') return true;
        if (this.state.actualScreen === 'twitchLink') return true;
        if (this.state.actualScreen === 'twitchWarning') {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.twitchLinkTitleXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkBodyXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkButtonXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.timing(this.state.linearGradientPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setTimeout(() => {
                    this.setState({ actualScreen: 'twitchLink' });
                    Animated.parallel([
                        Animated.timing(this.state.closeBackButtonIconWidth, {
                            toValue: 88,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconPosition, {
                            toValue: 2,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconMarginLeft, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkTitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkBodyXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkButtonXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                    ]).start();
                }, 100);
            });
            return true;
        }
        if (this.state.actualScreen === 'createUsername') {
            this.setState({ actualScreen: 'twitchWarning' });
            return true;
        }
        /**
         * If the user are on SignIn screen and comes from profile we navigate to achievements
         */
        if (this.props.currentScreen === 'SignIn' && this.state.originScreenWhenComponentMounted === 'Profile') {
            this.props.navigation.navigate('Achievements');
            return true;
        }

        return false;
    }

    /**
     * Start a session with facebook
     */
    signInWithFacebook = async () => {
        try {
            const user = await signInWithFacebook();
            this.succesfullSignIn(user);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Start a session with google
     */
    signInWithGoogle = async () => {
        try {
            const user = await signInWithGoogle();
            this.succesfullSignIn(user);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Check if the user is new, if it's new create the profile and send the user
     * to ChooseUserNameScreen
     * If isn't just close and back to the previous flow
     */
    succesfullSignIn = async (user) => {
        this.animationAfterLogin();
        if (user.additionalUserInfo.isNewUser) {

            this.setState({ email: user.user.email });
            return this.setState({ screen: 'createUsername' });
        } else {

            updateUserLoggedStatus(true, user.user.uid);
            subscribeUserToAllRegistredTopics(user.user.uid);

            if (await userHaveTwitchId(user.user.uid)) {
                if (this.props.originScreen !== 'Public') {
                    this.props.navigation.dismiss();
                } else {
                    this.props.navigation.navigate('MatchWizard');
                }

            } else {
                this.setState({ screen: 'twitchLink' });
                this.twitchLinkAnimation();
            }
        }
    }

    /**
    * Validate the agreements (terms and privacy), also validate the userName
    * if everything is right add the userName and returns the user to the previous flow
    */
    checkTermsConditionsAndUsername = async (onSuccess) => {
        if (this.state.username !== '' && !this.state.checkingUserName && this.state.agreementPrivacyState && this.state.agreementTermsState) {
            this.setState({
                checkingUserName: true,
                showErrorMessage: false
            }, async () => {
                if (await validateUserName(this.state.username)) {

                    await createUserProfile(this.props.uid, this.state.email, this.state.username);

                    //connectUserToSendBird(this.props.uid, this.state.username);

                    onSuccess();
                } else {
                    this.setState({
                        showErrorMessage: true,
                        checkingUserName: false
                    });
                }
            });
        }
    }


    navigateToLoginWithEmail = () => {
        this.props.navigation.navigate('LogIn', {
            originScreen: this.state.originScreenWhenComponentMounted,
        });
    }

    onAppleButtonPress = async () => {
        try {
            const user = await signInWithApple();
            this.succesfullSignIn(user);
        } catch (error) {
            console.log('Error', error);
        }
    }

    closeBackButtonHandler = () => {
        if (this.state.actualScreen === 'init') return this.props.navigation.navigate('Achievements');
        if (this.state.actualScreen === 'signUp' || this.state.actualScreen === 'logIn') {
            Animated.timing(this.state.closeBackButtonIconPosition, {
                toValue: 0,
                duration: this.state.closeBackButtonIconPositionAnimationDuration,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.signUpLogInButtonsHexColorController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.signUpLogInButtonsContentXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.topButtonXPosition, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.facebookButtonXPosition, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.titleXPositionController, {
                toValue: -1,
                duration: this.state.closeBackButtonIconPositionAnimationDuration,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start(() => {
                setTimeout(() => {
                    this.setState({
                        prevScreen: '',
                        actualScreen: 'init',
                    });
                    this.state.titleXPositionController.setValue(0);
                    this.setState({
                        nextScreen: '',
                    });
                }, 100);
            });
            return;
        }
        if (this.state.actualScreen === 'twitchWarning') {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.twitchLinkTitleXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkBodyXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.timing(this.state.twitchLinkButtonXPositionController, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                ]),
                Animated.timing(this.state.linearGradientPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setTimeout(() => {
                    this.setState({ actualScreen: 'twitchLink' });
                    Animated.parallel([
                        Animated.timing(this.state.closeBackButtonIconWidth, {
                            toValue: 88,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconPosition, {
                            toValue: 2,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconMarginLeft, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkTitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkBodyXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkButtonXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                    ]).start();
                }, 100);
            });
        }
    }

    succesfulRegistrationPharase = () => {
        if (this.state.streamer) {
            // add code to translation and replace word
            let text = `Ya estás participando en el stream de ${this.state.streamer} 💫💥. Llega a tiempo al stream para hacer tus canjes ;)`;
            let newTxt = text.split(' ');

            return <Text>{newTxt.map(text => {
                if (text.includes(this.state.streamer)) {
                    return <Text style={styles.aquaQaplaTextColor}>{text} </Text>;
                }
                return `${text} `;
            })}</Text>;

        }
        return 'Ya tienes una cuenta en Qapla, que te parece si vamos a ver los streams disponibles';
    }

    toggleAgreementTermsState = () => this.setState({ agreementTermsState: !this.state.agreementTermsState });

    toggleAgreementPrivacyState = () => this.setState({ agreementPrivacyState: !this.state.agreementPrivacyState });

    toggleTermsModal = () => this.setState({ openTermsModal: !this.state.openTermsModal });

    togglePrivacyModal = () => this.setState({ openPrivacyModal: !this.state.openPrivacyModal });

    logIn = () => {
        this.secondStepAnimation('logIn', 1);
    }

    signUp = () => {
        this.secondStepAnimation('signUp', 3);
    }

    secondStepAnimation = (nextScreen, steps) => {
        this.setState({ nextScreen, steps });
        console.log(Platform.OS !== 'ios' && !appleAuth.isSignUpButtonSupported)
        if (Platform.OS !== 'ios' && !appleAuth.isSignUpButtonSupported) {
            Animated.timing(this.state.topButtonXPosition, {
                toValue: 1,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
        }
        if (nextScreen === 'logIn') {
            Animated.timing(this.state.facebookButtonXPosition, {
                toValue: 1,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }).start();
        }
        Animated.timing(this.state.closeBackButtonIconPosition, {
            toValue: 1,
            duration: this.state.closeBackButtonIconPositionAnimationDuration,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.signUpLogInButtonsHexColorController, {
            toValue: 1,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.signUpLogInButtonsContentXPositionController, {
            toValue: 1,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.titleXPositionController, {
            toValue: 1,
            duration: this.state.closeBackButtonIconPositionAnimationDuration,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start(() => {
            setTimeout(() => {
                this.setState({
                    prevScreen: 'init',
                    actualScreen: nextScreen,
                });
                this.state.titleXPositionController.setValue(0);
                this.setState({
                    nextScreen: 'createUsername',
                });
            }, 100);
        });
    }

    animationAfterLogin = () => {
        Animated.timing(this.state.facebookButtonXPosition, {
            toValue: 2,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.agreementsController, {
            toValue: 1,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.closeBackButtonIconOpacity, {
            toValue: 0,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.bodyTextUsernameInputXPositionController, {
            toValue: 1,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.topButtonXPosition, {
            toValue: 1,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.signUpLogInButtonsHexColorController, {
            toValue: 2,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.signUpLogInButtonsContentXPositionController, {
            toValue: 2,
            duration: 400,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.titleXPositionController, {
            toValue: 1,
            duration: this.state.closeBackButtonIconPositionAnimationDuration,
            easing: Easing.cubic,
            useNativeDriver: false,
        }).start(() => {
            setTimeout(() => {
                this.setState({
                    steps: this.state.actualScreen === 'signUp' ? 3 : 1,
                    step: 1,
                    prevScreen: '',
                    actualScreen: 'createUsername',
                });
                this.state.titleXPositionController.setValue(0);
                this.setState({
                    nextScreen: '',
                });
            }, 100);
        });
    }

    twitchLink = () => {
        this.props.navigation.navigate('TwitchLogIn', {
            onSuccess: this.onSuccesfulLinkWithTwitch,
            back: true
        });
    }

    onSuccesfulLinkWithTwitch = () => {
        this.setState({ gradientTo: 0 });
        Animated.parallel([
            Animated.timing(this.state.twitchLogoXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkTitleXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkBodyXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkButtonXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setTimeout(() => {
                this.setState({ actualScreen: 'signUpLogInComplete' });
                Animated.sequence([
                    Animated.timing(this.state.linearGradientPositionController, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.cubic,
                        useNativeDriver: false,
                    }),
                    Animated.parallel([
                        Animated.timing(this.state.closeBackButtonIconOpacity, {
                            toValue: 0,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.awesomeHandYPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.succesfulRegisterTitleYPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.succesfulRegisterBodyYPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.succesfulRegisterButtonYPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                    ])
                ]).start();
            }, 100);
        });
    }

    submitUsername = () => {
        this.checkTermsConditionsAndUsername(() => {
            this.setState({ screen: 'twitchLink' });
            this.twitchLinkAnimation();
        });
    }

    twitchLinkAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.closeBackButtonIconOpacity, {
                toValue: 1,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.parallel([
                Animated.timing(this.state.bottomButtonXPosition, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.bodyTextUsernameInputXPositionController, {
                    toValue: 2,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.titleXPositionController, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.agreementsController, {
                    toValue: 2,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
            ]),
            Animated.parallel([
                Animated.timing(this.state.qaplaLogoYPositionController, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.linearGradientContrainerYPositionController, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => {
            setTimeout(() => {
                this.setState({
                    prevScreen: '',
                    actualScreen: 'twitchLink',
                });
                this.setState({
                    nextScreen: '',
                });
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(this.state.closeBackButtonIconWidth, {
                            toValue: 88,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconPosition, {
                            toValue: 2,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.closeBackButtonIconMarginLeft, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLogoXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkTitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkBodyXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.timing(this.state.twitchLinkButtonXPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                    ]).start();
                }, 100)
            }, 100);
        });
    }

    skipTwitchLink = () => {
        this.setState({ gradientTo: 1 });
        Animated.parallel([
            Animated.timing(this.state.twitchLinkTitleXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkBodyXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.twitchLinkButtonXPositionController, {
                toValue: 0,
                duration: 400,
                easing: Easing.cubic,
                useNativeDriver: false,
            }),
        ]).start(() => {
            this.setState({ actualScreen: 'twitchWarning' });
            setTimeout(() => {
                Animated.timing(this.state.linearGradientPositionController, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }).start(() => {
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(this.state.closeBackButtonIconWidth, {
                                toValue: 40,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.closeBackButtonIconPosition, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.closeBackButtonIconMarginLeft, {
                                toValue: 0,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.twitchLinkTitleXPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.twitchLinkBodyXPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.twitchLinkButtonXPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                        ]).start();
                    }, 100);
                });
            });
        });
    }

    noLinkTwitch = () => {
        if (true) {
            this.setState({ gradientTo: 2 });
            this.state.linearGradientContrainerYPositionController.setValue(0);
            Animated.parallel([
                Animated.timing(this.state.twitchLogoXPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.twitchLinkTitleXPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.twitchLinkSubtitleXPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.twitchLinkBodyXPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.twitchLinkButtonXPositionController, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setTimeout(() => {
                    this.setState({ actualScreen: 'signUpLogInComplete' });
                    Animated.sequence([
                        Animated.timing(this.state.linearGradientPositionController, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.cubic,
                            useNativeDriver: false,
                        }),
                        Animated.parallel([
                            Animated.timing(this.state.closeBackButtonIconOpacity, {
                                toValue: 0,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.awesomeHandYPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.succesfulRegisterTitleYPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.succesfulRegisterBodyYPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.succesfulRegisterButtonYPositionController, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.cubic,
                                useNativeDriver: false,
                            }),
                        ])
                    ]).start();
                }, 100);
            });
        }
    }

    returnToStreams = () => {
        this.props.navigation.navigate('Achievements');
    }

    dismissKeyboardHandler = () => {
        Keyboard.dismiss();
    }

    render() {
        return (
            <SafeAreaView style={[styles.sfvContainer, styles.darkQaplaBGColor]} >
                <Animated.View style={[styles.qaplaLogoView, {
                    // top: '8.6%',
                    top: getScreenHeight() * 0.08,
                    height: getScreenHeight() * 0.084,
                    transform: [{
                        translateY: this.state.qaplaLogoYPositionController.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, getScreenHeight() * 0.01],
                        }),
                    }],
                }]}>
                    <Image source={QaplaSignUpLogo2021}
                        style={{
                            resizeMode: 'center',
                            alignSelf: 'flex-start',
                            width: '100%',
                            height: '100%',
                        }} />
                </Animated.View>
                { this.state.actualScreen === 'createUsername' && <DismissKeyboardTouch onPress={this.dismissKeyboardHandler} />}

                <AnimatedTouchableOpacity
                    disabled={this.state.actualScreen === 'createUsername' || this.state.actualScreen === 'signUpLogInComplete'}
                    style={{
                        width: this.state.closeBackButtonIconWidth.interpolate({ inputRange: [40, 88], outputRange: [getScreenSizeMultiplier() * 40, getScreenSizeMultiplier() * 88] }),
                        height: getScreenSizeMultiplier() * 40,
                        marginLeft: this.state.closeBackButtonIconMarginLeft.interpolate({ inputRange: [0, 1], outputRange: [getScreenWidth() * 0.055, getScreenWidth() * 0.71] }),
                        marginTop: '7%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                        alignSelf: 'flex-start',
                    }}
                    onPress={this.state.actualScreen === 'twitchLink' ? this.skipTwitchLink : this.closeBackButtonHandler} >
                    <Animated.View style={{
                        opacity: this.state.closeBackButtonIconOpacity,
                        backgroundColor: '#262b6a',
                        borderRadius: 100,
                        width: this.state.closeBackButtonIconWidth.interpolate({ inputRange: [40, 88], outputRange: [getScreenSizeMultiplier() * 40, getScreenSizeMultiplier() * 88] }),
                        height: getScreenSizeMultiplier() * 40,
                        justifyContent: 'flex-start',
                    }}>
                        <Animated.View style={{
                            flexDirection: 'row',
                            marginTop: '-5%',
                            marginLeft: '-5%',
                            transform: [{ translateX: this.state.closeBackButtonIconPosition.interpolate({ inputRange: [0, 1, 2], outputRange: [0, getScreenWidth() * -0.122, getScreenWidth() * -0.315] }) }],
                        }}>
                            <View style={{ marginLeft: '-2.3%', marginTop: '3%' }}>
                                <CloseThiccIcon />
                            </View>
                            <View style={{ marginLeft: '-2%', marginTop: '3%' }}>
                                <LeftArrowThiccIcon />
                            </View>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.65)',
                                fontSize: getScreenSizeMultiplier() * 17,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                lineHeight: getScreenSizeMultiplier() * 22,
                                letterSpacing: getScreenSizeMultiplier() * 0.49,
                                textAlignVertical: 'center',
                                marginLeft: '10%',
                                width: '150%',
                            }}>Omitir</Text>
                        </Animated.View>
                    </Animated.View>
                </AnimatedTouchableOpacity>

                < Animated.View
                    style={
                        [styles.registroInicioSesionView,
                        {
                            marginTop: this.state.linearGradientContrainerYPositionController.interpolate({
                                inputRange: [0, 1],
                                outputRange: [getScreenHeight() * 0.165, getScreenHeight() * 0.024],
                            }),
                        }]} >
                    <Animated.View
                        pointerEvents="box-none"
                        style={{
                            flex: 1,
                            alignSelf: 'stretch',
                            // marginTop: '14%',
                        }}>
                        <View style={{
                            shadowColor: 'rgba(0, 0, 0, 0.14)',
                            shadowRadius: getScreenSizeMultiplier() * 5,
                            shadowOpacity: 1,
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            borderTopLeftRadius: getScreenSizeMultiplier() * 50,
                            borderTopRightRadius: getScreenSizeMultiplier() * 50,
                            overflow: 'hidden',
                        }}>
                            <Animated.View style={{
                                transform: [{
                                    translateY: this.state.linearGradientPositionController.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, getScreenHeight() * -0.85],
                                    }),
                                },
                                {
                                    translateX: this.state.linearGradientPositionController.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, getScreenWidth() * -1],
                                    }),
                                }],
                                height: '100%',
                                width: '100%',
                            }}>
                                <LinearGradient
                                    start={{
                                        x: 0.03,
                                        y: 0.08,
                                    }}
                                    end={{
                                        x: 0.95,
                                        y: 0.94,
                                    }}
                                    locations={[0, 0.499999999999999999, 0.5, 1]}
                                    colors={
                                        this.state.gradientTo === 1 ?
                                            [this.gradientColors.normalA, this.gradientColors.normalB, this.gradientColors.warningA, this.gradientColors.warningB]
                                            :
                                            this.state.gradientTo === 2 ?
                                                [this.gradientColors.warningA, this.gradientColors.warningB, this.gradientColors.registered, this.gradientColors.registered]
                                                :
                                                [this.gradientColors.normalA, this.gradientColors.normalB, this.gradientColors.registered, this.gradientColors.registered]
                                    }
                                    style={{
                                        shadowColor: 'rgba(0, 0, 0, 0.14)',
                                        shadowRadius: getScreenSizeMultiplier() * 5,
                                        shadowOpacity: 1,
                                        height: '200%',
                                        width: '200%',
                                    }}>
                                    <View
                                        style={styles.modalBgView} />
                                </LinearGradient>
                            </Animated.View>
                        </View>
                        {this.state.actualScreen === 'createUsername' && <DismissKeyboardTouch onPress={this.dismissKeyboardHandler} />}
                        <View
                            pointerEvents="box-none"
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                width: '100%',
                                top: this.state.actualScreen.includes('twitch') ? '10%' : '12.5%',
                                bottom: '8%',
                                alignItems: 'center',
                            }}>
                            {this.state.actualScreen.includes('twitch') ?
                                // Twitch screens
                                <View style={{ height: '100%', width: '100%', marginLeft: '20%' }}>
                                    <View style={{
                                        height: '10%',
                                        width: '37%',
                                        alignSelf: 'flex-start',
                                        overflow: 'hidden',
                                    }}>
                                        <Animated.View style={{
                                            width: '100%',
                                            height: '100%',
                                            transform: [{
                                                translateX: this.state.twitchLogoXPositionController.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [getScreenWidth() * -0.368, 0],
                                                }),
                                            }],
                                        }}>
                                            <TwitchExtrudedLogo />
                                        </Animated.View>
                                    </View>
                                    <View style={{ width: '70%', overflow: 'hidden' }}>
                                        <View style={{
                                            marginTop: '20.6%',
                                            width: '100%',
                                        }}>
                                            <Animated.View style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                transform: [{
                                                    translateX: this.state.twitchLinkTitleXPositionController.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [getScreenWidth() * -0.7, 0],
                                                    }),
                                                }],
                                            }}>
                                                {this.state.actualScreen === 'twitchWarning' && <View style={{ marginRight: '2%' }}><AlertIcon /></View>}
                                                <Text style={{
                                                    color: 'white',
                                                    fontSize: getScreenSizeMultiplier() * 30,
                                                    fontStyle: 'normal',
                                                    fontWeight: 'bold',
                                                    lineHeight: getScreenSizeMultiplier() * 30,

                                                }}>{this.titles[this.state.actualScreen]}</Text>
                                            </Animated.View>
                                        </View>
                                        <Animated.View style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            transform: [{
                                                translateX: this.state.twitchLinkSubtitleXPositionController.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [getScreenWidth() * -0.7, 0],
                                                }),
                                            }],
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: getScreenSizeMultiplier() * 22,
                                                fontStyle: 'normal',
                                                fontWeight: 'normal',
                                                lineHeight: getScreenSizeMultiplier() * 26,
                                                marginTop: '9.5%',
                                            }}>{this.subtitles[this.state.actualScreen]}</Text>
                                        </Animated.View>
                                        <Animated.View style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            transform: [{
                                                translateX: this.state.twitchLinkBodyXPositionController.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [getScreenWidth() * -0.7, 0],
                                                }),
                                            }],
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: getScreenSizeMultiplier() * (this.state.actualScreen === 'twitchWarning' ? 18 : 22),
                                                fontStyle: 'normal',
                                                fontWeight: 'normal',
                                                lineHeight: getScreenSizeMultiplier() * (this.state.actualScreen === 'twitchWarning' ? 24 : 26),
                                                marginTop: '9.5%',
                                            }}>{this.bodies[this.state.actualScreen]}</Text>
                                        </Animated.View>
                                    </View>
                                    <View style={{
                                        width: '70%',
                                        height: '12.8%',
                                        marginTop: this.state.actualScreen === 'twitchWarning' ? '14%' : '26.6%',
                                        marginLeft: this.state.actualScreen === 'twitchWarning' ? '5%' : '0%',
                                        overflow: 'hidden',
                                    }}>
                                        <Animated.View style={{
                                            width: '100%',
                                            height: '100%',
                                            transform: [{
                                                translateX: this.state.twitchLinkButtonXPositionController.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [getScreenWidth() * -0.7, 0],
                                                }),
                                            }],
                                        }}>
                                            <TouchableOpacity
                                                style={[{
                                                    borderRadius: getScreenSizeMultiplier() * 50,
                                                    width: '100%',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }, this.state.actualScreen === 'twitchWarning' ? styles.transparentWhiteBGColor : styles.twitchBGColor]}
                                                onPress={this.state.actualScreen === 'twitchWarning' ? this.noLinkTwitch : this.twitchLink}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    {this.state.actualScreen === 'twitchWarning' ?
                                                        <View style={{}}>
                                                            <Text
                                                                style={[styles.loginRegisterButtonsText, styles.whiteTextColor, { fontSize: getScreenSizeMultiplier() * 14 }]}>Deseo continuar</Text>
                                                        </View>
                                                        :
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: '-10%', width: '100%' }}>
                                                            <View style={{ height: '100%', width: '10%', marginLeft: '-5%', transform: [{ scale: 1.7 }] }}>
                                                                <TwitchIcon />
                                                            </View>
                                                            <View style={{ marginLeft: '7%' }}>
                                                                <Text
                                                                    style={[styles.loginRegisterButtonsText, styles.whiteTextColor, { fontSize: getScreenSizeMultiplier() * 14 }]}>Vincular con Twitch</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>
                                </View>
                                //End of Twitch screens
                                :
                                this.state.actualScreen === 'signUpLogInComplete' ?
                                    // Successful register screen
                                    <View style={{ height: '100%', width: '100%', alignItems: 'center' }}>
                                        <View style={{ alignItems: 'center', width: '80%', marginTop: '39%' }}>
                                            <View style={{ overflow: 'hidden' }}>
                                                <Animated.View style={{
                                                    transform: [{
                                                        translateY: this.state.succesfulRegisterTitleYPositionController.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [getScreenHeight() * 0.04, 0],
                                                        }),
                                                    }],
                                                }}>
                                                    <Text style={[styles.titleText, {}]}>¡Genial!</Text>
                                                </Animated.View>
                                            </View>

                                            <View style={{ marginTop: '6%', overflow: 'hidden' }}>
                                                <Animated.View style={{
                                                    transform: [{
                                                        translateY: this.state.succesfulRegisterBodyYPositionController.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [getScreenHeight() * 0.08, 0],
                                                        }),
                                                    }],
                                                }}>
                                                    <Text style={[styles.bodyText, {
                                                        fontSize: getScreenSizeMultiplier() * 17,
                                                        textAlign: 'center',
                                                        lineHeight: getScreenSizeMultiplier() * 22,
                                                    }]}>{this.succesfulRegistrationPharase()}</Text>
                                                </Animated.View>
                                            </View>
                                        </View>
                                        <View style={{
                                            width: '70%',
                                            marginTop: '43%',
                                            height: '13.7%',
                                            overflow: 'hidden',
                                        }}>
                                            <Animated.View style={{
                                                transform: [{
                                                    translateY: this.state.succesfulRegisterButtonYPositionController.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [getScreenHeight() * 0.095, 0],
                                                    }),
                                                }],
                                            }}>
                                                <TouchableOpacity
                                                    style={[{
                                                        borderRadius: getScreenSizeMultiplier() * 50,
                                                        width: '100%',
                                                        height: '100%',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }, styles.buttonSignUpBGColor]}
                                                    onPress={this.returnToStreams}
                                                >
                                                    <Text style={[styles.loginRegisterButtonsText, styles.darkQaplaTextColor]}>Volver a los streams</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        </View>

                                    </View>
                                    //End of Successful register screen
                                    :
                                    //Sign Up/Log In with Apple/Google Screens and Create Username
                                    <View style={{ flex: 1, height: '100%', width: '100%', alignItems: 'center', marginTop: this.state.keyboardIsActive ? '9.8%' : 0 }}>
                                        <View style={{
                                            width: '60%',
                                            height: getScreenHeight() * 0.082,
                                            marginTop: '0%',
                                            overflow: 'hidden',
                                        }}>
                                            <Animated.View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                transform: [
                                                    {
                                                        translateX: this.state.titleXPositionController.interpolate(
                                                            {
                                                                inputRange: [-1, 0, 1],
                                                                outputRange: [getScreenWidth() * 0.60, 0, getScreenWidth() * -0.60],
                                                            }
                                                        ),
                                                    },
                                                ],

                                            }}>
                                                <View style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}>
                                                    <Text style={[styles.titleText, { height: '100%', textAlignVertical: 'center' }]}>{this.titles[this.state.prevScreen]}</Text>
                                                </View>
                                                <View style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}>
                                                    <Text style={[styles.titleText, { height: '100%', textAlignVertical: 'center' }]}>{this.titles[this.state.actualScreen]}</Text>
                                                </View>
                                                <View style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}>
                                                    <Text style={[styles.titleText, { height: '100%', textAlignVertical: 'center' }]}>{this.titles[this.state.nextScreen]}</Text>
                                                </View>
                                            </Animated.View>
                                        </View>
                                        {this.state.actualScreen === 'createUsername' && <DismissKeyboardTouch onPress={this.dismissKeyboardHandler} />}
                                        <View style={{ width: getScreenWidth(), alignItems: 'center', height: '100%', marginTop: '0%' }}>
                                            <View style={{ width: '100%', alignItems: 'center', marginTop: '1%', height: '34.8%' }}>
                                                <Animated.View style={{
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    <View style={{ width: '100%' }}>
                                                        <View style={{
                                                            width: '70%',
                                                            overflow: 'hidden',
                                                            alignSelf: 'center',
                                                        }}>
                                                            <Animated.View style={{
                                                                justifyContent: 'center',
                                                                flexDirection: 'row',
                                                                width: '100%',
                                                                alignSelf: 'center',
                                                                transform: [
                                                                    {
                                                                        translateX: this.state.titleXPositionController.interpolate({
                                                                            inputRange: [-1, 0, 1],
                                                                            outputRange: [getScreenWidth() * 0.7, 0, getScreenWidth() * -0.7],
                                                                        }),
                                                                    },
                                                                ],
                                                            }}>
                                                                <View style={{
                                                                    width: '100%',
                                                                }}>
                                                                    <Text style={styles.bodyText}>{this.bodies[this.state.prevScreen]}</Text>
                                                                </View>
                                                                <View style={{
                                                                    width: '100%',
                                                                }}>
                                                                    <Text style={styles.bodyText}>{this.bodies[this.state.actualScreen]}</Text>
                                                                </View>
                                                                <View style={{
                                                                    width: '100%',
                                                                }}>
                                                                    <Text style={styles.bodyText}>{this.bodies[this.state.nextScreen]}</Text>
                                                                </View>
                                                            </Animated.View>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '100%', alignItems: 'center', marginTop: '14.2%', height: '100%', marginLeft: '-100%' }}>
                                                        <View style={{
                                                            width: '70%',
                                                            height: '100%',
                                                            overflow: 'hidden',
                                                        }}>
                                                            <Animated.View style={{
                                                                backgroundColor: 'rgb(13, 16, 34)',
                                                                borderRadius: 50,
                                                                width: '100%',
                                                                // height: '22%',
                                                                height: getScreenHeight() * 0.058,
                                                                transform: [{
                                                                    translateX: this.state.bodyTextUsernameInputXPositionController.interpolate({
                                                                        inputRange: [0, 1, 2],
                                                                        outputRange: [getScreenWidth() * 0.7, 0, getScreenWidth() * -0.7],
                                                                    }),
                                                                }],
                                                            }}>
                                                                <TextInput
                                                                    style={{
                                                                        color: 'rgb(0, 255, 220)',
                                                                        fontSize: getScreenSizeMultiplier() * 16,
                                                                        fontStyle: 'normal',
                                                                        fontWeight: 'normal',
                                                                        textAlign: 'left',
                                                                        lineHeight: getScreenSizeMultiplier() * 26,
                                                                        letterSpacing: getScreenSizeMultiplier() * 0.25,
                                                                        marginHorizontal: '7.2%',
                                                                        width: '86%',
                                                                        textAlignVertical: 'center',
                                                                        height: '100%',
                                                                    }}
                                                                    onFocus={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.linear); }}
                                                                    onBlur={() => { console.log('blur'); }}
                                                                    onChangeText={(text) => { this.setState({ username: text }); }}
                                                                    value={this.state.username}
                                                                    placeholder={'Nombre de usuario'}
                                                                    placeholderTextColor={'#009682'}
                                                                    ref={(ref) => { this.usernameInput = ref; }}
                                                                />
                                                            </Animated.View>
                                                        </View>
                                                    </View>
                                                </Animated.View>
                                            </View>
                                            <View style={{
                                                width: '70%',
                                                height: getScreenHeight() * 0.3,
                                                // marginTop: 0,
                                                top: getScreenHeight() * 0.202,
                                                alignItems: 'center',
                                                overflow: 'hidden',
                                                position: 'absolute',
                                            }}>
                                                <Animated.View style={{
                                                    width: '100%',
                                                    height: getScreenHeight() * 0.09,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    transform: [
                                                        {
                                                            translateX: this.state.topButtonXPosition.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0, getScreenWidth() * -0.7],
                                                            }),
                                                        },
                                                    ],
                                                }}>
                                                    <TouchableOpacity
                                                        style={[
                                                            {
                                                                borderRadius: getScreenSizeMultiplier() * 50,
                                                                width: '100%',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            },
                                                            { marginTop: '0%' }]}
                                                        onPress={this.state.actualScreen === 'init' ? this.signUp : this.onAppleButtonPress}
                                                        disabled={this.state.actualScreen !== 'init' && !(Platform.OS === 'ios' && appleAuth.isSignUpButtonSupported)}>
                                                        <Animated.View
                                                            style={{
                                                                backgroundColor: this.state.signUpLogInButtonsHexColorController.interpolate({
                                                                    inputRange: [0, 1], outputRange: [this.buttonsColors.signUp, this.buttonsColors.apple]
                                                                }),
                                                                height: '100%',
                                                                width: '100%',
                                                                justifyContent: 'center',
                                                                borderRadius: 100,
                                                                overflow: 'hidden',
                                                            }}>
                                                            <Animated.View style={{
                                                                flexDirection: 'row',
                                                                transform: [
                                                                    {
                                                                        translateX: this.state.signUpLogInButtonsContentXPositionController.interpolate({
                                                                            inputRange: [0, 1],
                                                                            outputRange: [0, getScreenWidth() * -0.70],
                                                                        }),
                                                                    },
                                                                ],
                                                            }}>
                                                                <View style={{ width: '100%' }}>
                                                                    <Text style={[styles.loginRegisterButtonsText, styles.darkQaplaTextColor]}>Crear mi cuenta</Text>
                                                                </View>
                                                                {Platform.OS === 'ios' && appleAuth.isSignUpButtonSupported &&
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                                        <View style={{ height: '100%', width: '10%', marginLeft: '-5%', transform: [{ scale: 1.7 }] }}>
                                                                            <AppleIcon />
                                                                        </View>
                                                                        <View style={{ marginLeft: '4%' }}>
                                                                            <Text
                                                                                style={[styles.loginRegisterButtonsText, styles.whiteTextColor, { fontSize: getScreenSizeMultiplier() * 14 }]}>Continuar con Apple</Text>
                                                                        </View>
                                                                    </View>
                                                                }
                                                            </Animated.View>
                                                        </Animated.View>
                                                    </TouchableOpacity>
                                                </Animated.View>

                                                <View
                                                    style={{
                                                        height: getScreenHeight() * 0.03,
                                                        width: '100%',
                                                    }} />
                                                <Animated.View style={{
                                                    width: '100%',
                                                    height: getScreenHeight() * 0.09,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    transform: [
                                                        {
                                                            translateX: this.state.bottomButtonXPosition.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0, getScreenWidth() * -0.7],
                                                            }),
                                                        },
                                                    ],
                                                }}>
                                                    <TouchableOpacity
                                                        style={[{
                                                            borderRadius: getScreenSizeMultiplier() * 50,
                                                            width: '100%',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }]}
                                                        onPress={this.state.actualScreen === 'init' ? this.logIn : this.state.actualScreen === 'createUsername' ? this.submitUsername : this.signInWithGoogle}>
                                                        <Animated.View
                                                            style={{
                                                                backgroundColor: this.state.signUpLogInButtonsHexColorController.interpolate({
                                                                    inputRange: [0, 1, 2], outputRange: [this.buttonsColors.logIn, this.buttonsColors.google, this.buttonsColors.signUp]
                                                                }),
                                                                height: '100%',
                                                                width: '100%',
                                                                justifyContent: 'center',
                                                                borderRadius: 100,
                                                                overflow: 'hidden',
                                                            }}>
                                                            <Animated.View style={{
                                                                flexDirection: 'row',
                                                                transform: [
                                                                    {
                                                                        translateX: this.state.signUpLogInButtonsContentXPositionController.interpolate({
                                                                            inputRange: [0, 1, 2],
                                                                            outputRange: [0, getScreenWidth() * -0.70, getScreenWidth() * -1.40],
                                                                        }),
                                                                    },
                                                                ],
                                                            }}>
                                                                <View style={{ width: '100%' }}>
                                                                    <Text style={[styles.loginRegisterButtonsText, styles.whiteTextColor]}>Ya tengo cuenta</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                                    <View style={{ height: '100%', width: '10%', marginLeft: '-4.6%', transform: [{ scale: 1.3 }] }}>
                                                                        <GoogleIcon />
                                                                    </View>
                                                                    <View style={{ marginLeft: '6.8%' }}>
                                                                        <Text
                                                                            style={[styles.loginRegisterButtonsText, styles.blackTextColor, { fontSize: getScreenSizeMultiplier() * 14 }]}>Continuar con Google</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{ width: '100%' }}>
                                                                    <Text style={[styles.loginRegisterButtonsText, styles.darkQaplaTextColor]}>¡Estoy listo!</Text>
                                                                </View>
                                                            </Animated.View>
                                                        </Animated.View>
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            </View>
                                        </View>
                                    </View>
                                //End of Sign Up/Log In with Apple/Google Screens
                            }
                        </View>
                    </Animated.View>
                </Animated.View >
                {/* Start of Facebook Button */}
                {(this.state.nextScreen === 'logIn' || this.state.actualScreen === 'logIn') &&
                    <View style={{
                        height: getScreenHeight() * 0.09,
                        width: '70%',
                        position: 'absolute',
                        bottom: (Platform.OS === 'ios' && appleAuth.isSignUpButtonSupported) ? getScreenHeight() * 0.37 : getScreenHeight() * 0.2511,
                        left: '15%',
                        overflow: 'hidden',
                    }} >
                        <Animated.View style={{
                            width: '100%',
                            height: getScreenHeight() * 0.09,
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [
                                {
                                    translateX: this.state.facebookButtonXPosition.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [getScreenWidth() * 0.7, 0, getScreenWidth() * -0.7],
                                    }),
                                },
                            ],
                        }}>
                            <TouchableOpacity
                                style={[
                                    {
                                        borderRadius: getScreenSizeMultiplier() * 50,
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    { marginTop: '0%' }]}
                                onPress={() => console.log('facebook')}>
                                <Animated.View
                                    style={{
                                        backgroundColor: '#3b5998',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                        borderRadius: 100,
                                        overflow: 'hidden',
                                    }}>
                                    <Animated.View style={{
                                        flexDirection: 'row',
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                            <View style={{ height: '100%', width: '10%', marginLeft: '1%', transform: [{ scale: 1.5 }] }}>
                                                <FacebookIcon />
                                            </View>
                                            <View style={{ marginLeft: '4%' }}>
                                                <Text
                                                    style={[styles.loginRegisterButtonsText, styles.whiteTextColor, { fontSize: getScreenSizeMultiplier() * 14 }]}>Continuar con Facebook</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </Animated.View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                }
                {/* End of Facebook Button */}
                <Animated.View style={{
                    position: 'absolute',
                    width: '100%',
                    height: getScreenHeight() * 0.07,
                    top: getScreenHeight() * 0.6,
                    opacity: this.state.agreementsController,
                    transform: [{
                        translateX: this.state.agreementsController.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [getScreenWidth() * 1, 0, getScreenWidth() * -1]
                        }),
                    }],
                }}>
                    <View>
                        <CheckBox
                            label={translate('chooseUserNameScreen.agreeWithTerms')}
                            onPress={this.toggleAgreementTermsState}
                            onTextPress={this.toggleTermsModal}
                            textStyle={{ textDecorationLine: 'underline', color: Colors.greenQapla }}
                            selected={this.state.agreementTermsState}
                            disabled={this.state.checkingUserName} />
                    </View>
                    <View style={{ flex: 1 }} />
                    <View>
                        <CheckBox
                            label={translate('chooseUserNameScreen.agreeWithPrivacy')}
                            onPress={this.toggleAgreementPrivacyState}
                            onTextPress={this.togglePrivacyModal}
                            textStyle={{ textDecorationLine: 'underline', color: Colors.greenQapla }}
                            selected={this.state.agreementPrivacyState}
                            disabled={this.state.checkingUserName} />
                    </View>

                </Animated.View>
                <View style={{
                    flex: 1,
                    position: 'absolute',
                    height: getScreenHeight() * 0.011,
                    width: '33%',
                    bottom: '5%',
                    alignSelf: 'center',
                }}>
                    {this.state.actualScreen !== 'init' && this.state.actualScreen !== 'signUpLogInComplete' && !this.state.keyboardIsActive &&
                        <ProgressDotsIndicator
                            steps={this.state.steps}
                            selected={this.state.step}
                            color={'rgba(0,254,223,0.54)'}
                            activeColor={'#00FEDF'}
                            width={getScreenHeight() * 0.011}
                            activeWidth={'25%'}
                            marginHorizontal={'5%'}
                        />
                    }
                </View>
                <View style={{
                    height: '30%',
                    width: '50%',
                    top: '1%',
                    left: '25%',
                    overflow: 'hidden',
                    position: 'absolute',
                }}>
                    <Animated.View style={{
                        width: '100%',
                        height: '100%',
                        transform: [{
                            translateY: this.state.awesomeHandYPositionController.interpolate({
                                inputRange: [0, 1],
                                outputRange: [getScreenHeight() * 0.26, 0],
                            }),
                        }],
                    }}>
                        <Image
                            source={AwesomeHand}
                            style={{ resizeMode: 'contain', height: '100%', width: '100%' }}
                        />
                    </Animated.View>
                </View>
                {this.state.actualScreen === 'signUpLogInComplete' &&
                    <Animated.View style={{
                        backgroundColor: 'rgba(13, 16, 34, 0.36)',
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        position: 'absolute',
                        height: '11%',
                        width: '100%',
                        bottom: 0,
                        transform: [{
                            translateY: this.state.succesfulRegisterTutorialYPositionController.interpolate({
                                inputRange: [0, 1],
                                outputRange: [getScreenHeight() * 0.11, 0],
                            }),
                        }],
                    }}>
                        <TouchableOpacity style={{
                            marginTop: '8%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: '20%',
                            width: '100%',
                        }}>
                            <Text style={{
                                color: 'rgba(37, 172, 255, 0.65)',
                                fontSize: 14,
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                textAlign: 'left',
                                lineHeight: 18,
                                letterSpacing: 0.22,
                                marginLeft: 26,
                            }}>Ver tutorial sobre canjes, Qoins y XQ</Text>
                            <View style={{ flex: 1 }} />
                            <View style={{
                                backgroundColor: '#0D1022',
                                width: getScreenWidth() * 0.06,
                                height: getScreenWidth() * 0.06,
                                marginRight: '10%',
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{ transform: [{ scaleX: -1 }, { scale: 0.6 }], marginLeft: '-2%', marginTop: '6%' }}>
                                    <LeftArrowThiccIcon />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                }
                <TermsAndConditionsModal
                    open={this.state.openTermsModal}
                    onClose={this.toggleTermsModal} />
                <PrivacyModal
                    open={this.state.openPrivacyModal}
                    onClose={this.togglePrivacyModal} />

            </SafeAreaView >
        );
    }
}

function mapDispatchToProps(state) {
    return {
        originScreen: state.screensReducer.previousScreenId,
        currentScreen: state.screensReducer.currentScreenId,
        uid: state.userReducer.user.id
    };
}

export default connect(mapDispatchToProps)(SignUpLoginHandlerScreen);
