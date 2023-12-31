import React, { Component } from 'react';
import {
    ActivityIndicator,
    View,
    SafeAreaView,
    Alert
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';
import { TWITCH_CLIENT_ID, TWITCH_REDIRECT_URI } from '../../utilities/Constants';
import { getTwitchUserData } from '../../services/twitch';
import { saveTwitchData, isNewTwitchId, uidExists, getUserWithTwitchId } from '../../services/database';
import { connect } from 'react-redux';
import { generateAuthTokenForTwitchSignIn } from '../../services/functions';
import { auth } from '../../utilities/firebase';
import Colors from '../../utilities/Colors';

class TwitchAuthScreen extends Component {
    alreadyLoaded = false;
    state = {
        hideWebView: false
    };

    async handleNavigation(data) {
        const url = data.url;
        let regex = /[#&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

        while ((match = regex.exec(url))) {
            params[match[1]] = match[2];
        }
        const { access_token } = params;
        if (!this.alreadyLoaded && access_token) {
            this.setState({ hideWebView: true });

            this.alreadyLoaded = true;
            const data = await getTwitchUserData(access_token);

            // If uid exists a user is trying to link their account with Twitch
            if (this.props.uid) {
                if (await isNewTwitchId(data.id)) {
                    await saveTwitchData(this.props.uid, {
                        photoUrl: data.profile_image_url,
                        twitchAccessToken: access_token,
                        twitchId: data.id,
                        twitchUsername: data.display_name
                    });

                    if (this.props.onLinkSuccess) {
                        this.props.onLinkSuccess();
                    }
                } else {
                    Alert.alert('Error', 'Twitch account already linked with other Qapla account',
                    [
                        { text: "OK", onPress: this.props.onFail }
                    ]);
                }
                // If no uid we assume a user is trying to signin/signup with Twitch from the auth
            } else {
                // Uid´s of users created with Twitch accounts are their Twitch id´s
                if (await uidExists(data.id)) {
                    const qaplaCustomAuthToken = await generateAuthTokenForTwitchSignIn(data.id, data.display_name);
                    const user = await auth.signInWithCustomToken(qaplaCustomAuthToken.data.token);
                    await saveTwitchData(user.user.uid, {
                        photoUrl: data.profile_image_url,
                        twitchAccessToken: access_token,
                        twitchId: data.id,
                        twitchUsername: data.display_name
                    });
                    if (this.props.onAuthSuccessful) {
                        this.props.onAuthSuccessful(user, false);
                    }
                } else {
                    // If the twitchId is not linked to other Qapla account
                    if (await isNewTwitchId(data.id)) {
                        const qaplaCustomAuthToken = await generateAuthTokenForTwitchSignIn(data.id, data.display_name);
                        const user = await auth.signInWithCustomToken(qaplaCustomAuthToken.data.token);
                        await saveTwitchData(user.user.uid, {
                            photoUrl: data.profile_image_url,
                            twitchAccessToken: access_token,
                            twitchId: data.id,
                            twitchUsername: data.display_name
                        });

                        if (this.props.onAuthSuccessful) {
                            this.props.onAuthSuccessful(user, true);
                        }
                    } else {
                        /**
                         * User may have use another provider to create their account, but we can require
                         * a custom token knowing their uid
                         */
                        const existentUser = await getUserWithTwitchId(data.id);
                        let userUid = '';
                        existentUser.forEach((user) => {
                            userUid = user.key;
                        });
                        const customAuthToken = await generateAuthTokenForTwitchSignIn(userUid, data.display_name);
                        const user = await auth.signInWithCustomToken(customAuthToken.data.token);
                        await saveTwitchData(user.user.uid, {
                            photoUrl: data.profile_image_url,
                            twitchAccessToken: access_token,
                            twitchId: data.id,
                            twitchUsername: data.display_name
                        });

                        if (this.props.onAuthSuccessful) {
                            this.props.onAuthSuccessful(user, true);
                        }
                    }
                }
            }
        }
    }

    render() {
        const uri = `https://id.twitch.tv/oauth2/authorize?` +
            `client_id=${TWITCH_CLIENT_ID}&` +
            `redirect_uri=${TWITCH_REDIRECT_URI}&` +
            'response_type=token&' +
            `scope=user:read:email%20user:read:subscriptions%20user:read:follows%20user:read:broadcast`;

        return (
            <SafeAreaView style={styles.sfvContainer}>
                {!this.state.hideWebView ?
                    <View style={[styles.container, { opacity: this.state.hideWebView ? 0 : 1 }]}>
                        <WebView
                            source={{ uri }}
                            onNavigationStateChange={(data) => this.handleNavigation(data)}
                            scalesPageToFit={true} />
                    </View>
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#131833' }}>
                        <ActivityIndicator size='large' color={Colors.greenQapla} />
                    </View>
                }
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        uid: state.userReducer.user.id
    }
}

export default connect(mapStateToProps)(TwitchAuthScreen);