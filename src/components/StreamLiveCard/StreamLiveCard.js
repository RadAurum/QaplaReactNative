import React from 'react';
import { View, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Image, Linking } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { getLocaleLanguage } from '../../utilities/i18';
import QaplaText from '../QaplaText/QaplaText';
import { trackOnSegment } from '../../services/statistics';
import Images from './../../../assets/images';

const StreamCardContainer = ({ children, onPress }) => (
    <TouchableWithoutFeedback onPress={onPress}
        style={styles.container}>
        <View style={styles.container}>
            {children}
        </View>
    </TouchableWithoutFeedback>
);

class StreamLiveCard extends React.PureComponent {
    state = {
        boost: [false, false, false, true],
        qoins: true,
        xq: true,
    };

    /**
     * Select the correct event text content according to the language used by the user
     * in the app.
     *
     * @param {object} textLangObj Object containing in JSON format a text content for each
     *                             language supported by the app
     */
    getTextBasedOnUserLanguage = (textLangObj) => {
        let res = '';
        const userLanguage = getLocaleLanguage();

        if (textLangObj && textLangObj[userLanguage]) {
            res = textLangObj[userLanguage];
        }

        return res;
    }

    goToStreamerChannel = () => {
        Linking.openURL(this.props.stream.streamerChannelLink);
        trackOnSegment('User press live card', {
            Streamer: this.props.stream.streamerName,
            StreamId: this.props.stream.id
        });
    }

    render() {
        const {
            title,
            thumbnailUrl,
            streamerPhoto,
            streamerName,
            idStreamer,
            streamerChannelLink,
            customRewardsMultipliers
        } = this.props.stream;

        let titleTranslated = this.getTextBasedOnUserLanguage(title);

        /**
         * 404 Twitch image for default (if the user does not have thumbnailUrl for any reason this prevent
         * the app from crashing)
         */
        let thumbnail = 'https://static-cdn.jtvnw.net/ttv-static/404_preview-480x270.jpg';

        if (thumbnailUrl) {
            thumbnail = thumbnailUrl.replace('{width}', '480').replace('{height}', '270');
        }

        return (
            <StreamCardContainer onPress={this.goToStreamerChannel}>
                <LinearGradient
                    style={styles.backgroundImageContainer}
                    useAngle={true}
                    angle={150}
                    angleCenter={{ x: 0.5, y: 0.5 }}
                    colors={['#AA16EE', '#07EAFA']}>
                    <ImageBackground
                        imageStyle={styles.backgroundImage}
                        style={styles.backgroundImageContainer}
                        blurRadius={5}
                        source={thumbnail ? { uri: thumbnail } : null}>
                        <View style={{ display: 'flex', width: '100%', height: '100%' }}>
                            <Image source={thumbnail ? { uri: thumbnail } : null}
                                style={{
                                    position: 'absolute',
                                    top: 28,
                                    left: 0,
                                    right: 0,
                                    height: 160
                                }}
                            />
                            <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#f0f0', marginTop: 24, marginRight: 24, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                {customRewardsMultipliers && (customRewardsMultipliers.xq === 2 || customRewardsMultipliers.qoins === 2) &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.2 }], marginRight: '-2.4%', marginTop: 3, backgroundColor: '#ff00' }}>
                                        <Images.svg.boostX2 />
                                    </View>
                                }
                                {customRewardsMultipliers && (customRewardsMultipliers.xq === 3 || customRewardsMultipliers.qoins === 3) &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.2 }], marginRight: '-2.4%', marginTop: 3, backgroundColor: '#ff00' }}>
                                        <Images.svg.boostX3 />
                                    </View>
                                }
                                {customRewardsMultipliers && (customRewardsMultipliers.xq === 5 || customRewardsMultipliers.qoins === 5) &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.2 }], marginRight: '-2.4%', marginTop: -1, backgroundColor: '#ff00' }}>
                                        <Images.svg.boostX5 />
                                    </View>
                                }
                                {customRewardsMultipliers && (customRewardsMultipliers.xq === 10 || customRewardsMultipliers.qoins === 10) &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.25 }], marginRight: '-2.4%', marginTop: -1, backgroundColor: '#ff00' }}>
                                        <Images.svg.boostX10 />
                                    </View>
                                }
                                {customRewardsMultipliers && customRewardsMultipliers.qoins > 1 &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.3 }], marginLeft: '1.6%', backgroundColor: '#ff00', marginTop: 10 }}>
                                        <Images.svg.qoin />
                                    </View>
                                }
                                {customRewardsMultipliers && customRewardsMultipliers.xq > 1 &&
                                    <View style={{ display: 'flex', transform: [{ scale: 1.3 }], marginLeft: '1.4%', backgroundColor: '#ff00', marginTop: 10 }}>
                                        <Images.svg.activityXQ />
                                    </View>
                                }
                            </View>
                        </View>
                    </ImageBackground>
                </LinearGradient>
                <View style={styles.body}>
                    <View style={styles.titleContainer}>
                        <QaplaText numberOfLines={3} style={styles.title}>
                            {titleTranslated}
                        </QaplaText>
                    </View>
                    <View style={{ height: 16 }} />
                    <TouchableOpacity onPress={() => this.props.onStreamerProfileButtonPress(idStreamer, streamerChannelLink)}>
                        <LinearGradient
                            style={styles.streamerDetails}
                            useAngle={true}
                            angle={150}
                            angleCenter={{ x: 0.5, y: 0.5 }}
                            colors={['#141539', '#141539']}>
                            <Image
                                style={styles.streamerPhoto}
                                source={streamerPhoto ? { uri: streamerPhoto } : null} />
                            <QaplaText style={styles.streamPlatformText}>
                                {streamerName}
                            </QaplaText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </StreamCardContainer >
        );
    }
}

function mapDispatchToProps(state) {
    return {
        uid: state.userReducer.user.id,
        games: state.gamesReducer.games
    }
}

export default connect(mapDispatchToProps)(withNavigation(StreamLiveCard));