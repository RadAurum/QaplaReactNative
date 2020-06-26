// diego          - 11-12-2019 - us165 - Validate if the user is logged before redirect or open modal
// josep.sanahuja - 26-09-2019 - us118 - Added goToSocialLink & ImagePickerModal
// josep.sanahuja - 20-09-2019 - us111 - Added disabledContainer logic
// josep.sanahuja - 19-09-2019 - us114 - File creation

import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';

import styles from './style';
import Images from '../../../assets/images';

import { redeemLogroCloudFunction } from '../../services/functions';
import { saveImgEvidenceUrlLogroSocial, createLogroIncompletoChild } from '../../services/database';
import { savePictureEvidenceLogroSocial } from '../../services/storage';
import { isUserLogged } from '../../services/auth';

import LogroLifeTimeBadge from './LogroLifeTimeBadge/LogroLifeTimeBadge';
import ImagePickerModal from '../../components/ImagePicker/ImagePickerModal/ImagePickerModal';
import OneTxtOneBttnModal from '../OneTxtOneBttnModal/OneTxtOneBttnModal'
import { translate, getLocaleLanguage } from '../../utilities/i18';
import QaplaText from '../QaplaText/QaplaText';

const QaploinIcon = Images.svg.qaploinsIcon;

class LogroSocial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showImgPckModal: false,
            picture: null,
            openThankyouModal: false
        };
    }

    /**
     * Validates that the url is a valid url
     */
    urlIsValid() {
        /**
         * Reg. exp to check for valid url's
         * Lear more about reg exp in: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions
         */
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(this.state.url);
    }

    /**
     * Send the user to the social link page (if app is installed then asked to open with the app)
     */
    goToSocialLink = () => {
        if (isUserLogged()) {
            Linking.openURL(this.props.pageLink);
        } else {
            this.props.navigation.navigate('SignIn');
        }
    }

    /**
     * Sends the selected picture by ImagePickerModal and sends it to
     * Firebase Storage.
     *
     * @param {object} picture Picture selected in ImagePickerModal
     */
    saveImage = (picture) => {
        this.setState({
            picture: picture,
            openThankyouModal: true
        });

        let evProm = savePictureEvidenceLogroSocial(picture.node.image.uri, this.props.id, this.props.userId);

        // In case the picture is successfully stored in Firebase Datastorage,
        // then an evidence of that picture will be saved in Firebase DB for
        // verification purposes.
        if (evProm !== null) {
            const dbRes = saveImgEvidenceUrlLogroSocial(this.props.id, this.props.userId);

            // After the reference to the evidence image is written to DB,
            // an entry for the logro is created to DB in logroIcompleto child,
            // to track the status of the completeness of the logro.
            if (dbRes !== null) {
                createLogroIncompletoChild(this.props.id, this.props.userId);
            }
        }
    }

    /**
     * Closes ImagePickerModal
     */
    closeImgPckModal = () => {
        this.setState({
            showImgPckModal: false
        });
    }

    /**
     * Opens ImagePickerModal
     */
    openImgPckModal = () => {
        if (isUserLogged()) {
            this.setState({
                showImgPckModal: true
            });
        } else {
            this.props.navigation.navigate('SignIn');
        }
    }

    /**
     * Redeem the logro calling to the cloud function
     */
    redeemLogro = () => {
        redeemLogroCloudFunction(this.props.id, this.props.qaploins);
    }

    /**
    * Description:
    * Closes Modal that gives information to the user after
    * user redeemed the logro
    */
    toggleOpenThankyouModal = () => {
        this.setState({
          openThankyouModal: !this.state.openThankyouModal
        });
    }

    /**
     * Select the correct event text content according to the language used by the user
     * in the app.
     * 
     * @param {object} textLangObj Object containing in JSON format a text content for each
     *                             language supported by the app
     */
    getTextBasedOnUserLanguage = (textLangObj) => {
        const res = '';
        const userLanguage = getLocaleLanguage();

        if (textLangObj && textLangObj[userLanguage]) {
            res = textLangObj[userLanguage];
        }

        return res;
    }

    render() {
        const {
            title,
            titulo,
            description,
            descripcion,
            qaploins,
            photoUrl,
            puntosCompletados,
            totalPuntos,
            tiempoLimite,
            verified
        } = this.props;
        
        let descriptionTranslated = getTextBasedOnUserLanguage(description);
        let titleTranslated = getTextBasedOnUserLanguage(title);

        // (01-04-2020) Events on 2019 and early 2020 used 'titulos' and 'descripcion' props, 
        // as a result of a change on the events structure data in db description and title
        // were added for internationalization. These two if conditions for 'descriptionTranslated'
        // and 'titleTranslated' are to check that the props exists in the db event element,
        // otherwise a fallback is used (not ideal situation, but to prevent app crashes to the
        // user)
        if (descriptionTranslated === '') {
            descriptionTranslated = descripcion;
        }

        if (titleTranslated === '') {
            titleTranslated = titulo;
        }

        return (
            <View style={verified ? styles.container : styles.disabledContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.colASocialContainer}>
                        <Image style={styles.picture} source={{uri: photoUrl}} />
                    </View>
                    <View style={styles.colBSocialContainer}>
                        <View style={styles.titleContainer}>
                            <QaplaText style={styles.titleSocial}>{titleTranslated}</QaplaText>
                        </View>
                        <QaplaText style={styles.description}>{descriptionTranslated}</QaplaText>
                    </View>
                    <View style={styles.colCSocialContainer}>
                        <View style={styles.qaploinsContainer}>
                            <QaploinIcon height={31} width={31} style={styles.qaploinIcon} />
                            <QaplaText style={styles.qaploinsText}>{qaploins}</QaplaText>
                        </View>
                        <LogroLifeTimeBadge limitDate={tiempoLimite} />
                        {puntosCompletados >= totalPuntos &&
                            <TouchableWithoutFeedback
                                onPress={this.redeemLogro}
                                /**Just a double check on disabled property of the button */
                                disabled={puntosCompletados < totalPuntos}>
                                <View style={styles.redimirButton}>
                                    <QaplaText style={styles.redimirTextButton}>{translate('activeAchievementsScreen.socialAchievement.redeem')}</QaplaText>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                    </View>
                </View>
                {/**
                    If the user don't have progress on the logro
                    or
                    If the user have progress but not enough to redeem the logro
                 */}
                {(!puntosCompletados || puntosCompletados < totalPuntos) &&
                    <View style={styles.shareContainer}>
                        <TouchableWithoutFeedback onPress={this.goToSocialLink}>
                            <View>
                                <QaplaText style={styles.likeText}>{translate('activeAchievementsScreen.socialAchievement.like')}</QaplaText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.openImgPckModal}>
                            <View>
                                <QaplaText style={styles.uploadText}>{translate('activeAchievementsScreen.socialAchievement.upload')}</QaplaText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                <ImagePickerModal
                      visible={this.state.showImgPckModal}
                      saveImage={this.saveImage}
                      onClose={this.closeImgPckModal} />
                <OneTxtOneBttnModal
                    visible={ this.state.openThankyouModal }
                    onClose={ this.toggleOpenThankyouModal }
                    header={translate('activeAchievementsScreen.socialAchievement.modal.header')}
                    body={translate('activeAchievementsScreen.socialAchievement.modal.body')}
                    textButton={translate('activeAchievementsScreen.socialAchievement.modal.textButton')} />

            </View>
        );
    }
}

export default withNavigation(LogroSocial);

