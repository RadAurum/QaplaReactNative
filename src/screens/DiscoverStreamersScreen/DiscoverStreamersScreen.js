import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import styles from './style';
import StreamerCardsList from '../../components/StreamerCardsList/StreamerCardsList';
import { getStreamersData } from '../../actions/streamersActions';
import { BOTTOM_NAVIGATION_BAR_HEIGHT, STREAMERS_BLACKLIST, TWITCH_AFFILIATE, TWITCH_PARTNER } from '../../utilities/Constants';

class DiscoverStreamersScreen extends Component {
    componentDidMount() {
        this.props.getStreamersProfiles(40);
    }

    loadMoreStreamers = () => {
        this.props.getStreamersProfiles(20, this.props.streamers[this.props.streamers.length - 1].key);
    }

    formatStreamers = () => {
        const streamersData = [];
        this.props.streamers.forEach((streamer) => {
            if (!STREAMERS_BLACKLIST.includes(streamer.key) && !this.props.userSubscriptions[streamer.key]) {
                if ((streamer.backgroundGradient || streamer.backgroundUrl)
                    && streamer.displayName && streamer.photoUrl && streamer.bio && streamer.tags &&
                    (streamer.broadcasterType === TWITCH_PARTNER || streamer.broadcasterType === TWITCH_AFFILIATE)) {
                    streamersData.push({
                        displayName: streamer.displayName,
                        /**
                         * If the streamer change their profile image on Twitch the link on the database
                         * will not contain any photo to show until the streamer update their information
                         * on the dashboard (this is automatically done every time the streamer SignIn on the
                         * dashboard or any time a token is refreshed)
                         */
                        photoUrl: streamer.photoUrl,
                        streamerId: streamer.key,
                        bio: streamer.bio,
                        backgroundUrl: streamer.backgroundUrl,
                        badge: streamer.badge,
                        tags: streamer.tags,
                        creatorCodes: streamer.creatorCodes,
                        backgroundGradient: streamer.backgroundGradient
                    });
                }
            }
        });

        return streamersData;
    }

    goToStreamerProfile = (streamerData) => {
        this.props.navigation.navigate('StreamerProfile', { streamerData });
    }

    render() {
        const streamersData = this.formatStreamers();
        return (
            <View style={styles.container}>
                <StreamerCardsList streamersData={streamersData}
                    onEndReached={this.loadMoreStreamers}
                    onCardPress={this.goToStreamerProfile}
                    horizontal={this.props.horizontal}
                    dynamicSeparation={this.props.dynamicSeparation}/>
                {/**
                 * View with height is to avoid Bottom bar on content
                 */}
                <View style={{ marginBottom: BOTTOM_NAVIGATION_BAR_HEIGHT * 1.25 }} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        streamers: state.streamersReducer.streamers || [],
        userSubscriptions: state.userReducer.user.userToStreamersSubscriptions || {}
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getStreamersProfiles: (limit, cursor) => getStreamersData(limit, cursor)(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverStreamersScreen);