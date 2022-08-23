import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import { translate } from '../../../utilities/i18';
import styles from '../style';
import images from '../../../../assets/images';
import { GIPHY_GIFS } from '../../../utilities/Constants';
import DeckButton from '../../../components/DeckButton/DeckButton';
import { trackOnSegment } from '../../../services/statistics';

class PrepaidInteractionsAddTTS extends Component {
    state = {
        mediaCost: null,
        dataFetched: false
    };

    componentDidMount() {
        this.fetchMediaCost()
    }

    fetchMediaCost = async () => {
        // TTS is free for pre paid interactions
        this.setState({ mediaCost: 0, dataFetched: true });
    }

    sendTTS = async () => {
        trackOnSegment('TTS Added After Media Selection');

        this.props.navigation.navigate('PrepaidInteractionsTTS', {
            ...this.props.navigation.state.params
        });
    }

    sendOnlyMedia = () => {
        trackOnSegment('Send Only Media Without TTS');
        this.props.navigation.navigate('PrepaidInteractionsCheckout', { ...this.props.navigation.state.params });
    }

    render() {
        const streamerName = this.props.navigation.getParam('displayName', '');
        const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);

        if (this.state.dataFetched) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={[styles.innerConatiner, styles.addTTSContainer]}>
                        <Text style={[styles.whiteText, styles.screenHeaderText, styles.screenHeaderTextAddTTS]}>
                            {translate('interactions.addTTS.addTTSInYourInteraction')}
                        </Text>
                        <View style={{
                            alignItems: 'flex-start',
                        }}>
                            <DeckButton
                                onPress={this.sendTTS}
                                label="Text-to-Speech"
                                hideCost
                                backgroundIndex={2}
                                icon={images.svg.interactionsTTS}
                            />
                            <View style={styles.chatBubbleContainer}>
                                <Text style={[styles.whiteText, styles.chatBubbleText]}>
                                    {`${translate('interactions.addTTS.addAMessageP1')} `}
                                    <Text style={[styles.accentTextColor, styles.chatBubbleTextAccent]}>
                                        {streamerName}
                                    </Text>
                                    {`${translate('interactions.addTTS.addAMessageP2')} `}
                                    <Text style={[styles.accentTextColor, styles.chatBubbleTextAccent]}>
                                        {this.state.mediaCost}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                onPress={this.sendTTS}
                                style={[styles.bottomButton, styles.bottomButtonBackground]}>
                                <Text style={[styles.whiteText, styles.bottomButtonText]}>
                                    {`${translate('interactions.addTTS.add')}`}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.sendOnlyMedia}
                                style={styles.noBottomButton}>
                                <Text style={[styles.bottomButtonText, styles.noBottomButtomText, styles.marginTop16]}>
                                    {`${translate('interactions.addTTS.onlySendMy')} `}
                                    <Text style={[styles.whiteText, styles.noBottomButtonTextAccent]}>
                                        {translate(`interactions.addTTS.mediaTypes.${mediaType}`)}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            );
        }

        return <SafeAreaView style={styles.container}></SafeAreaView>;
    }

}

export default PrepaidInteractionsAddTTS;