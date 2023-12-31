import React, { Component, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import styles from './style';
import images from './../../../assets/images';
import { getRandomSearchStreamerGif, getRecentStreamersDonations, getStreamerPublicData, getStreamersByName, getUserReactionsCount } from '../../services/database';
import { TWITCH_AFFILIATE, TWITCH_PARTNER } from '../../utilities/Constants';
import { getStreamerProfilePhotoUrl } from '../../services/storage';
import { heightPercentageToPx } from '../../utilities/iosAndroidDim';
import { translate } from '../../utilities/i18';

const StreamerItem = ({ uid, streamerUid, streamerImage, streamerName, premium, selected, onStreamerPress }) => {
    const [numberOfReactions, setNumberOfReactions] = useState(undefined);
    const [streamerFallbackImage, setStreamerFallbackImage] = useState(null);

    useEffect(() => {
        async function getReactions() {
            if (uid) {
                const reactions = await getUserReactionsCount(uid, streamerUid);
                setNumberOfReactions(reactions.val() ?? 0);
            } else {
                setNumberOfReactions(0);
            }
        }

        if (!selected) {
            getReactions();
        }
    }, []);

    const getStreamerFallbackImage = async () => {
        try {
            setStreamerFallbackImage(await getStreamerProfilePhotoUrl(streamerUid));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TouchableOpacity style={styles.streamerContainer}
            onPress={() => onStreamerPress({ streamerUid, streamerImage, streamerName, premium })}>
            <View style={styles.streamerImageAndNameContainer}>
                <Image style={styles.streamerImage}
                    source={
                        streamerFallbackImage ?
                            { uri: streamerFallbackImage }
                        :
                            { uri: streamerImage }
                    }
                    onError={getStreamerFallbackImage} />
                {selected &&
                    <View style={{ position: 'absolute', bottom: 0, left: 32, zIndex: 9999 }}>
                        <images.svg.checkCircle height={20} width={20} />
                    </View>
                }
                <Text style={styles.streamerName} numberOfLines={1}>
                    {streamerName}
                </Text>
            </View>
            <View style={{ flex: 1 }} />
            {!selected &&
                <View style={styles.numberOfReactionsContainer}>
                    <images.svg.zap height={16} width={16} />
                    {numberOfReactions !== undefined ?
                        <Text style={styles.numberOfReactions} numberOfLines={1}>
                            {numberOfReactions.toLocaleString()}
                        </Text>
                        :
                        <ActivityIndicator size='small' color='rgb(61, 249, 223)'
                            style={{ height: 24, width: 24 }} />
                    }
                </View>
            }
        </TouchableOpacity>
    );
}

class ChooseStreamerModal extends Component {
    state = {
        searchQuery: '',
        recentStreamers: [],
        requestedStreamers: [],
        keyboardHeight: 0,
        gif: null,
        gifAspectRatio: 1
    };

    searchTimeout = null;

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
			this.setState({ keyboardHeight: parseInt(e.endCoordinates.height) });
		});
		this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
			this.setState({ keyboardHeight: 0 });
		});
    }

    componentWillUnmount() {
        this.keyboardWillHideListener.remove();
        this.keyboardWillShowListener.remove();
    }

    onModalOpen = async () => {
        await this.getRecentStreamers();
        if (this.state.recentStreamers.length <= 0 && this.props.selectedStreamer.streamerUid === '') {
            this.getRandomGif();
        }
    }

    getRandomGif = async () => {
        const gif = await getRandomSearchStreamerGif();

        Image.getSize(gif.val(), (width, height) => {
            const aspectRatio = width / height;
            this.setState({ gifAspectRatio: aspectRatio });
        });

        this.setState({ gif: gif.val() });
    }

    getRecentStreamers = async () => {
        if (this.props.uid) {
            const streamers = await getRecentStreamersDonations(this.props.uid, 5);
            const recentStreamersKeys = [];
            streamers.forEach((streamer) => {
                if (!this.props.selectedStreamer || streamer.key !== this.props.selectedStreamer.streamerUid) {
                    recentStreamersKeys.push(streamer.key);
                }
            });

            const recentStreamers = [];

            for (let i = 0; i < recentStreamersKeys.length; i++) {
                const streamerKey = recentStreamersKeys[i];
                const streamerData = await getStreamerPublicData(streamerKey);

                if (streamerData.exists()) {
                    recentStreamers.push({
                        streamerUid: streamerKey,
                        streamerImage: streamerData.val().photoUrl,
                        streamerName: streamerData.val().displayName,
                        premium: streamerData.val().premium
                    });
                }
            }

            this.setState({ recentStreamers });
        }
    }

    searchHandler = (searchQuery) => {
        clearTimeout(this.searchTimeout);
        this.setState({ searchQuery, requestedStreamers: [] });
        if (searchQuery !== '') {
            this.searchTimeout = setTimeout(async () => {
                const streamers = await getStreamersByName(searchQuery);
                if (streamers.exists()) {
                    const requestedStreamers = [];
                    streamers.forEach((streamerSnapshot) => {
                        const streamer = streamerSnapshot.val();
                        if (streamer.broadcasterType === TWITCH_PARTNER || streamer.broadcasterType === TWITCH_AFFILIATE) {

                            requestedStreamers.push({
                                streamerUid: streamerSnapshot.key,
                                streamerImage: streamerSnapshot.val().photoUrl,
                                streamerName: streamerSnapshot.val().displayName,
                                premium: streamerSnapshot.val().premium
                            });
                        }
                    });

                    this.setState({ requestedStreamers });
                }
            }, 250);
        }
    }

    renderStreamer = ({item, index}) => (
        <StreamerItem key={`recentStreamer-${index}`}
            {...item}
            uid={this.props.uid}
            onStreamerPress={this.props.onStreamerPress} />
    );

    render() {
        return (
            <Modal visible={this.props.open}
                onRequestClose={this.props.onClose}
                animationType='slide'
                onShow={this.onModalOpen}
                onDismiss={() => this.setState({ recentStreamers: [], searchQuery: '' })}
                transparent>
                <KeyboardAvoidingView behavior='padding'
                    // Android handles this behavior by himself
                    enabled={Platform.OS === 'ios'}
                    style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={[styles.gridMainContainer, {
                            height: Platform.OS === 'ios' ? heightPercentageToPx(50) + this.state.keyboardHeight : heightPercentageToPx(50)
                        }]}>
                            <View style={styles.gridSearchBarContainer}>
                                <TouchableOpacity onPress={this.props.onClose}>
                                    <images.svg.closeIcon style={styles.closeIcon} />
                                </TouchableOpacity>
                                <View style={[styles.searchBar, styles.gridSearchBar]}>
                                    <View style={{ opacity: 0.4 }}>
                                        <images.svg.searchStreamerIcon style={styles.searchIcon} />
                                    </View>
                                    <TextInput autoFocus
                                        value={this.state.searchQuery}
                                        onChangeText={this.searchHandler}
                                        style={styles.gridSearchBarTextInput}
                                        placeholder={translate('chooseStreamerModal.search')}
                                        placeholderTextColor='#fff3'
                                        keyboardAppearance='dark' />
                                </View>
                            </View>
                            <View style={styles.listContainer}>
                                {this.state.searchQuery === '' ?
                                    this.state.recentStreamers.length > 0 || this.props.selectedStreamer.streamerUid !== '' ?
                                        <>
                                        {this.props.selectedStreamer.streamerUid !== '' &&
                                            <StreamerItem selected
                                                onStreamerPress={this.props.onStreamerPress}
                                                {...this.props.selectedStreamer}
                                                uid={this.props.uid} />
                                        }
                                        {this.state.recentStreamers.length > 0 &&
                                            <Text style={styles.recents}>
                                                {translate('chooseStreamerModal.recents')}
                                            </Text>
                                        }
                                        <FlatList ListHeaderComponent={() => <View style={{ height: 24 }} />}
                                            ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
                                            ListFooterComponent={() => <View style={{ height: 144 }} />}
                                            keyboardShouldPersistTaps='handled'
                                            keyboardDismissMode='none'
                                            keyExtractor={(item) => item.streamerUid}
                                            data={this.state.recentStreamers}
                                            renderItem={this.renderStreamer} />
                                        </>
                                        :
                                        <View style={styles.noContentGifContainer}>
                                            <>
                                            <Image style={[styles.noContentGif, {
                                                    aspectRatio: this.state.gifAspectRatio
                                                }]}
                                                source={this.state.gif ?
                                                    { uri: this.state.gif}
                                                    :
                                                    null
                                                } />
                                            <Text style={styles.noContentText}>
                                                {translate('chooseStreamerModal.whosTheReactionFor')}
                                            </Text>
                                            </>
                                        </View>
                                    :
                                    <FlatList ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
                                        ListFooterComponent={() => <View style={{ height: 48 }} />}
                                        keyboardShouldPersistTaps='handled'
                                        keyboardDismissMode='none'
                                        keyExtractor={(item) => item.streamerUid}
                                        data={this.state.requestedStreamers}
                                        renderItem={this.renderStreamer} />
                                }
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

export default ChooseStreamerModal;