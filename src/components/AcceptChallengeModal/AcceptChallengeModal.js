// diego          - 12-09-2019 - us99 - Added close icon to allow user cancelation
// diego          - 06-09-2019 - us93 - Replace Switch for custom CheckBox component
// diego          - 04-09-2019 - us106 - Logic to accept challenge implemented
// diego          - 06-08-2019 - us68 - File creation

import React, { Component } from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';

import styles from './style';
import { storeData } from '../../utilities/persistance';
import { acceptChallengeRequest } from '../../services/functions';
import { withNavigation } from 'react-navigation';
import CheckBox from '../CheckBox/CheckBox';
import Images from './../../../assets/images';
import { translate } from '../../utilities/i18';
import QaplaIcon from '../QaplaIcon/QaplaIcon';
import QaplaText from '../QaplaText/QaplaText';

const CloseIcon = Images.svg.closeIcon;

class AcceptChallengeModal extends Component {
    state = {
        dontShowModalAgain: false
    };

    /**
     * @description Method called when the user accepts to delete all the notifications of the same match
     */
    acceptDelete = () => {
        if (this.state.dontShowModalAgain) {
            storeData('dont-show-delete-notifications-modal', 'true');
        }

        acceptChallengeRequest(this.props.notification, this.props.uid);
        this.props.navigation.navigate('MyMatches');
    }

    /**
     * @description Toogle the dontShowModalAgain flag to the selected state of the checkbox
     */
    setCheckBoxState = (newState) => {
        this.setState({ dontShowModalAgain: newState });
    }

    render() {
        return (
            <Modal
                animationType='none'
                transparent
                visible={this.props.visible}
                onRequestClose={this.props.onClose}>
                    <View style={styles.mainContainer}>
                        <View style={styles.container}>
                            <QaplaIcon onPress={this.props.onClose} touchableStyle={styles.closeIcon}>
                                <CloseIcon />
                            </QaplaIcon>
                            <QaplaText style={styles.paragraph}>
                                {translate('notificationsScreen.acceptChallengeModal.body')}
                            </QaplaText>
                            <CheckBox
                                style={styles.checkbox}
                                label={translate('notificationsScreen.acceptChallengeModal.dontShowItAgain')}
                                selected={this.state.dontShowModalAgain}
                                onPress={this.setCheckBoxState} />
                            <TouchableWithoutFeedback onPress={this.acceptDelete}>
                                <View style={styles.gotItButton}>
                                    <QaplaText style={styles.gotItButtonText}>{translate('notificationsScreen.acceptChallengeModal.continue')}</QaplaText>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
            </Modal>
        );
    }
}

export default withNavigation(AcceptChallengeModal);
