// diego          - 11-12-2019 - us160 - Updated analitycs
// diego          - 12-09-2019 - us99 - Added close icon to allow user cancelation on upload result
// diego          - 19-08-2019 - us89 - Add UploadMatchEvidenceModal and UploadMatchResultsModal
// diego          - 13-08-2019 - us77 - Added navigation to UploadClutchEvidenceScreen
// josep.sanahuja - 06-08-2019 - us78 - File creation

import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';

import styles from './style';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

import Images from './../../../assets/images';
import UploadClutchEvidenceScreen from '../UploadClutchEvidenceScreen/UploadClutchEvidenceScreen';
import { uploadMatchResult } from '../../services/database';
import UploadMatchResultsModal from '../../components/UploadMatchResultsModal/UploadMatchResultsModal';
import UploadMatchEvidenceModal from '../../components/UploadMatchEvidenceModal/UploadMatchEvidenceModal';
import { WON_RESULT, TIE_RESULT, LOST_RESULT, OTHER_RESULT } from '../../utilities/Constants';
import { recordScreenOnSegment, trackOnSegment } from '../../services/statistics';
import { translate } from '../../utilities/i18';

const CloseIcon = Images.svg.closeIcon;
const WinIcon = Images.svg.winIcon;
const LostIcon = Images.svg.lostIcon;
const TieIcon = Images.svg.tieIcon;
const ChooseClipIcon = Images.svg.chooseClipIcon;
const AlreadyChoosedClipIcon = Images.svg.alreadyChoosedClipIcon;

class UploadMatchResultScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
          matchResultStatus: null,
          evidenceUrl: '',
          uploadingEvidence: false,
          showUploadMatchResultsModal: false,
          showUploadMatchEvidenceModal: false
      };
    }

    componentWillMount(){
        this.list = [
            /**
             * This event is triggered when the user enter (focus) on this screen
             */
            this.props.navigation.addListener(
                'willFocus',
                (payload) => recordScreenOnSegment('Upload result Screen')
            )
        ];
    }
    /**
     * Description:
     * Toogles and hightlight the correct match result button. If a button is activated
     * and then pressed, it won't update the the state.
     *
     * @param {string}  result Result of the match
     *
     */
    toogleResultButton = (result) => {
        if (result != null && result !== undefined && result !== this.state.matchResultStatus) {
            this.setState({
                matchResultStatus: result
            });
        }
    }

    /**
     * Open the UploadClutchEvidenceScreen
     */
    sendToUploadEvidence = () => {
        this.setState({
            uploadingEvidence: true
        });
    }

    /**
     * Get the inserted url afther that was validated on UploadClutchEvidenceScreen and back to the initial screen
     * @param {string} url Url inserted by the user on the UploadClutchEvidenceScreen
     */
    getEvidenceData = (url) => {
        this.setState({
            evidenceUrl: url,
            uploadingEvidence: false
        });
    }

    /**
     * Validate the result checking if the user have uploaded evidence, if have, upload the result, if not, open the modal
     */
    validateResultToUpload = () => {
        if (this.state.evidenceUrl !== '') {
            this.uploadResult();
        } else {
            this.setState({ showUploadMatchEvidenceModal: true });
        }
    }

    /**
     * Upload user match result to firebase database
     */
    uploadResult = async () => {
        try {
            let {matchResultStatus} = this.state;

            const matchData = this.props.navigation.getParam('matchData');

            /**
             * A result of type 'TIE_RESULT' has (in the cloud functions) the same logic than 'OTHER_RESULT',
             * we just need to identify wich one here for UI questions
             */
            if (matchResultStatus === TIE_RESULT) {
                matchResultStatus = OTHER_RESULT;
            }
            await uploadMatchResult(
                matchData.idMatch,
                this.props.navigation.getParam('currentUserAdversary'),
                matchResultStatus,
                this.state.evidenceUrl
            );

            trackOnSegment('Upload result Button', {
                Game: matchData.game,
                Platform: matchData.platform,
                Bet: matchData.bet,
                UserQaploins: this.props.userQaploins,
                Result: matchResultStatus,
                Evidence: this.state.evidenceUrl !== ''
            });
            this.setState({ showUploadMatchResultsModal: true })
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Close the UploadMatchResultsModal
     */
    closeUploadMatchResultsModal = () => {
        this.setState({ showUploadMatchResultsModal: false });
    }

    /**
     * Close the UploadMatchEvidenceModal
     */
    closeUploadMatchEvidenceModal = () => {
        this.setState({ showUploadMatchEvidenceModal: false });
    }

    /**
     * Close the UploadMatchResultScreen
     */
    closeUploadMatchResultScreen = () => this.props.navigation.pop();

    /**
     * Close clutch screen and back to UploadMatchResultScreen
     */
    backToUploadMatchResultScreen = () => this.setState({ uploadingEvidence: false });

    render() {
        return (
            <SafeAreaView style={styles.sfvContainer}>
                {this.state.uploadingEvidence ?
                    <UploadClutchEvidenceScreen
                        backToUploadMatchResultScreen={this.backToUploadMatchResultScreen}
                        sendEvidenceData={this.getEvidenceData} />
                    :
                    <View style={styles.container}>
                        <TouchableWithoutFeedback onPress={this.closeUploadMatchResultScreen}>
                            <View style={styles.closeIcon}>
                                <CloseIcon />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.winLooseContainer}>
                            <TouchableWithoutFeedback onPress={this.toogleResultButton.bind(this, WON_RESULT)}>
                                <View>
                                    <WinIcon
                                        width={widthPercentageToPx(25)}
                                        height={heightPercentageToPx(20)}
                                        fill={this.state.matchResultStatus === WON_RESULT ? '#08D597' : '#B3B3B3'} />
                                    <Text style={[styles.resultDecription, { color: this.state.matchResultStatus === WON_RESULT ? '#08D597' : '#B3B3B3' }]}>
                                        {translate('uploadMatchResultScreen.results.won')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.winLooseSeparator} />
                            <TouchableWithoutFeedback onPress={this.toogleResultButton.bind(this, TIE_RESULT)}>
                                <View style={{ alignSelf: 'center' }}>
                                    <TieIcon
                                        width={widthPercentageToPx(18)}
                                        height={heightPercentageToPx(14)}
                                        fill={this.state.matchResultStatus === TIE_RESULT ? '#6D7DDE' : '#B3B3B3'} />
                                    <Text style={[styles.resultDecription, { color: this.state.matchResultStatus === TIE_RESULT ? '#6D7DDE' : '#B3B3B3' }]}>
                                        {translate('uploadMatchResultScreen.results.draw')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.winLooseSeparator} />
                            <TouchableWithoutFeedback onPress={this.toogleResultButton.bind(this, LOST_RESULT)}>
                                <View>
                                    <LostIcon
                                        width={widthPercentageToPx(25)}
                                        height={heightPercentageToPx(20)}
                                        fill={this.state.matchResultStatus === LOST_RESULT ? '#FF0000' : '#B3B3B3'} />
                                    <Text style={[styles.resultDecription, { color: this.state.matchResultStatus === LOST_RESULT ? '#FF0000' : '#B3B3B3' }]}>
                                        {translate('uploadMatchResultScreen.results.lost')}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.uploadEvidence}>
                            <TouchableWithoutFeedback onPress={this.sendToUploadEvidence}>
                                {this.state.evidenceUrl !== '' ?
                                    <AlreadyChoosedClipIcon height={150} width={150} fill='#FF0000' />
                                    :
                                    <ChooseClipIcon height={150} width={150} fill='#FF0000' />
                                }
                            </TouchableWithoutFeedback>
                        </View>
                        <Text style={styles.footerEvidence}>{translate('uploadMatchResultScreen.evidence')}</Text>
                        <TouchableWithoutFeedback onPress={this.toogleResultButton.bind(this, OTHER_RESULT)}>
                            <View style={[styles.otherResultButton, { borderColor: this.state.matchResultStatus === OTHER_RESULT ? '#6D7DDE' : '#B3B3B3' }]}>
                                <Text style={styles.buttonText}>{translate('uploadMatchResultScreen.results.dontPlayed')}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        {this.state.matchResultStatus &&
                            <TouchableWithoutFeedback onPress={this.validateResultToUpload}>
                                <View style={styles.uploadResultButton}>
                                    <Text style={styles.buttonText}>{translate('uploadMatchResultScreen.uploadResult')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <UploadMatchResultsModal
                            visible={this.state.showUploadMatchResultsModal}
                            onClose={this.closeUploadMatchResultsModal}
                            nextScreen='Publicas' />
                        <UploadMatchEvidenceModal
                            visible={this.state.showUploadMatchEvidenceModal}
                            onClose={this.closeUploadMatchEvidenceModal}
                            cb1={this.uploadResult} />
                    </View>
                }
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        userQaploins: state.userReducer.user.credits
    };
}

export default connect(mapStateToProps)(UploadMatchResultScreen);
