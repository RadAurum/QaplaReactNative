import React, { Component } from 'react';
import { TouchableOpacity, Image, View, ScrollView, Linking, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

import images from '../../../assets/images';
import QaplaChip from '../../components/QaplaChip/QaplaChip';
import SocialLinkContainedButton from '../../components/SocialLinkContainedButton/SocialLinkContainedButton';
import { getStreamerPublicProfile, getStreamerSocialLinks } from '../../services/database';
import { copyDataToClipboard } from '../../utilities/utils';
import { getLocaleLanguage, translate } from './../../utilities/i18';
import styles from './style';

const socialMediaIcons = {
    Twitch: images.svg.twitchLight,
    Instagram: images.svg.instagram,
    Twitter: images.svg.twitter,
    Discord: images.svg.discordSocial,
    TikTok: images.svg.tikTok,
    Youtube: images.svg.youTube
}

class StreamerProfileScreen extends Component {
    state = {
        showAllTags: false,
        nextStreams: [],
        socialLinks: [],
        streamerData: {
            displayName: '',
            photoUrl: '',
            streamerId: '',
            bio: '',
            backgroundUrl: '',
            badge: false,
            creatorCodes: {},
            tags: []
        }
    };

    componentDidMount() {
        this.props.navigation.addListener('didFocus', this.loadStreamerData);

        this.loadStreamerData();
    }

    loadStreamerData = async () => {
        let streamerData = this.props.navigation.getParam('streamerData', null);
        let streamerId = '';

        if (!streamerData) {
            // If the data does not exist then the user comes from a deep link and we only have the streamerId
            streamerId = this.props.navigation.getParam('streamerId', '');

            // So we get the streamer public profile data directly from the database
            const streamerData = await getStreamerPublicProfile(streamerId);

            this.setState({ streamerData: streamerData.val() });
        } else {
            streamerId = streamerData.streamerId;

            this.setState({ streamerData });
        }

        const streamerLinks = await getStreamerSocialLinks(streamerId);

        if (streamerLinks.exists()) {
            this.setState({ socialLinks: streamerLinks.val() });
        }

        // Determine upcoming events and sort it by time
        const streamerEvents = Object.keys(this.props.logros.logrosActivos)
        .filter((eventId) => this.props.logros.logrosActivos[eventId].idStreamer && this.props.logros.logrosActivos[eventId].idStreamer === streamerId)
        .map((eventId) => this.props.logros.logrosActivos[eventId]).sort((a, b) => a.timestamp - b.timestamp);

        // Only show the 2 most upcoming streams
        this.setState({ nextStreams: streamerEvents.slice(0, 2) });
    }

    formatStreamDate = (timestamp) => {
        const today = new Date();
        const streamDate = new Date(timestamp);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const streamDayName = today.getDate() === streamDate.getDate() ?
            translate('days.today')
            :
            today.getDate() + 1 === streamDate.getDate() ?
                translate('days.tomorrow')
                :
                translate(`days.${days[streamDate.getDay()]}`);
        let streamDayNumber = '';

        if (streamDayName !== translate('days.today') && streamDayName !== translate('days.tomorrow')) {
            streamDayNumber = streamDate.getDate() < 10 ? `0${streamDate.getDate()}` : streamDate.getDate();
        }

        return `${streamDayName} ${streamDayNumber}`;
    }

    formatStreamHour = (timestamp) => {
        const streamDate = new Date(timestamp);
        const hourSuffix = streamDate.getHours() >= 12 ? 'p.m.' : 'a.m.';
        hour = streamDate.getHours() % 12;
        hour = hour ? hour : 12;
        minute = streamDate.getMinutes() > 9 ? streamDate.getMinutes() : `0${streamDate.getMinutes()}`;

        return `${hour}:${minute} ${hourSuffix}`;
    }

    onSocialButtonPress = (url) => Linking.openURL(url);

    render() {
        const {
            displayName,
            photoUrl,
            bio,
            backgroundUrl,
            badge,
            tags
        } = this.state.streamerData;
        const userLanguage = getLocaleLanguage();

        return (
            // We don´t use SafeAreaView intentionally here, we want the cover image and TopNav to appear at the top of the screen
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.topNav}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <images.svg.backIcon />
                        </TouchableOpacity>
                    </View>
                    <Image source={backgroundUrl ? { uri: backgroundUrl } : null}
                        style={styles.backgroundImage} />
                    <View style={styles.photoContainer}>
                        <Image source={photoUrl ? { uri: photoUrl } : null}
                            style={styles.photo} />
                    </View>
                    <View style={styles.profileContainer}>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => console.log('Follow Button Press')}>
                                <View style={styles.followButton}>
                                    <Text style={styles.followButtonText}>
                                        {translate('streamerProfileScreen.follow')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Share Icon Press')}>
                                <View style={styles.iconContainer}>
                                    <images.svg.share />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Send Icon Press')}>
                                <View style={styles.iconContainer}>
                                    <images.svg.sendIcon />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.streamerName}>
                                {displayName}
                            </Text>
                            {badge &&
                                <images.svg.founderBadge style={{ marginTop: 8 }} />
                            }
                        </View>
                        <Text style={styles.bio}>
                            {bio}
                        </Text>
                        {tags && tags.length > 0 &&
                            <View style={styles.tagsContainer}>
                                {!this.state.showAllTags ?
                                <>
                                    {tags.slice(0, 5).map((tag) => (
                                        <QaplaChip style={styles.tagsMargin}>
                                            {tag}
                                        </QaplaChip>
                                    ))}
                                    {tags.length > 5 &&
                                        <TouchableOpacity onPress={() => this.setState({ showAllTags: true })}>
                                            <images.svg.moreCircle />
                                        </TouchableOpacity>
                                    }
                                </>
                                :
                                <>
                                    {tags.map((tag) => (
                                        <QaplaChip style={styles.tagsMargin}>
                                            {tag}
                                        </QaplaChip>
                                    ))}
                                    <TouchableOpacity onPress={() => this.setState({ showAllTags: false })}>
                                        <images.svg.lessCircle />
                                    </TouchableOpacity>
                                </>
                                }
                            </View>
                        }
                        {this.state.nextStreams && this.state.nextStreams.length > 0 &&
                            <View style={styles.upcomingStreamsContainer}>
                                <Text style={styles.sectionTitle}>
                                    {translate('streamerProfileScreen.upcomingStreams')}
                                </Text>
                                {this.state.nextStreams.map((nextStream) => (
                                    <>
                                        <LinearGradient useAngle={true}
                                            angle={133.34}
                                            style={styles.upcomingStreamImageLinearGradientBackground}
                                            colors={['#2C07FA', '#A716EE']}>
                                            <Image style={styles.upcomingStreamImage}
                                                source={{ uri: nextStream.backgroundImage }} />
                                        </LinearGradient>
                                        <Text style={styles.upcomingStreamTitle}>
                                            {nextStream.title[userLanguage]}
                                        </Text>
                                        <View style={styles.nextStreamTimeContainer}>
                                            <View style={styles.timeContainer}>
                                                <images.svg.calendar style={{ alignSelf: 'center' }} />
                                                <Text style={styles.timeText}>
                                                    {this.formatStreamDate(nextStream.timestamp)}
                                                </Text>
                                            </View>
                                            <View style={styles.timeContainer}>
                                                <images.svg.clock />
                                                <Text style={styles.timeText}>
                                                    {this.formatStreamHour(nextStream.timestamp)}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                ))}
                            </View>
                        }
                        {this.state.socialLinks && this.state.socialLinks.length > 0 &&
                            <View style={styles.streamerCommunityContainer}>
                                <Text style={styles.sectionTitle}>
                                    {translate('streamerProfileScreen.myCommunity')}
                                </Text>
                                <View style={styles.socialButtonsContainer}>
                                    {this.state.socialLinks.map((socialLink) => (
                                        <SocialLinkContainedButton onPress={() => this.onSocialButtonPress(socialLink.value)}
                                            Icon={socialMediaIcons[socialLink.socialPage]}
                                            style={styles.socialButton}
                                            key={`social-${socialLink.socialPage}`}>
                                            {socialLink.socialPage}
                                        </SocialLinkContainedButton>
                                    ))}
                                </View>
                            </View>
                        }
                        {this.state.streamerData.creatorCodes && Object.keys(this.state.streamerData.creatorCodes).length > 0 &&
                            <View style={styles.creatorCodesContainer}>
                                <Text style={styles.sectionTitle}>
                                    {translate('streamerProfileScreen.creatorCodes')}
                                </Text>
                                {Object.values(this.state.streamerData.creatorCodes).map((code) => (
                                    <View style={styles.creatorCodeImage}>
                                        <Image style={styles.creatorCodeImage}
                                            source={{ uri: code.imageUrl }} />
                                            <View style={styles.createrCodeButtonContainer}>
                                                <View style={styles.creatorCodeButton}>
                                                    <TouchableOpacity onPress={() => copyDataToClipboard(code.code)}>
                                                        <View style={styles.codeButton}>
                                                            <Text style={styles.codeText} numberOfLines={1}>
                                                                {code.code}
                                                            </Text>
                                                            <View style={styles.copyCode}>
                                                                <images.svg.copyCreatorCode />
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                    </View>
                                ))}
                            </View>
                        }
                    </View>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        logros: state.logrosReducer
    };
}

export default connect(mapStateToProps)(StreamerProfileScreen);