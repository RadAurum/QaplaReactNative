import React, { Component } from 'react';
import { View, Image, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';

import styles from './style';
import images from '../../../assets/images';
import RadMasonry from '../../components/RadMasonry/RadMasonry';
import { generateGiphyUserRandomId, getGiphyTrending, searchGiphyMedia } from '../../services/Giphy';
import { GIPHY_GIFS, GIPHY_STICKERS, MEDIA_TO_LOAD_FROM_GIPHY } from '../../utilities/Constants';
import { getLocaleLanguage, translate } from '../../utilities/i18';
import { getEmotesLibrary } from '../../services/database';

class InteractionsGiphyMediaSelector extends Component {
    state = {
        searchQuery: '',
        gifSection: 1,
        keyboardHeight: 0,
        media: []
    };
    searchTimeout = null;

    componentDidMount() {
        this.fetchTrendingMedia();
    }

    fetchTrendingMedia = async () => {
        let giphyRandomId = '';
        if (!this.props.giphyId) {
            giphyRandomId = await generateGiphyUserRandomId();
        } else {
            giphyRandomId = this.props.giphyId;
        }

        const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);
        let media = [];
        if (mediaType === GIPHY_STICKERS) {
            const qaplaEmotes = await getEmotesLibrary();
            if (qaplaEmotes.exists()) {
                qaplaEmotes.forEach((emote) => {
                    const item = {
                        images: {
                            fixed_height_small: {
                                url: emote.val().url,
                                height: emote.val().height,
                                width: emote.val().width,
                            },
                            original: {
                                url: emote.val().url,
                                height: emote.val().height,
                                width: emote.val().width,
                            },
                        },
                    };
                    media.push(item);
                });
            }
        }

        media = media.concat(await getGiphyTrending(giphyRandomId, mediaType, MEDIA_TO_LOAD_FROM_GIPHY));

        this.setState({ media });
    }

    searchHandler = (e) => {
        clearTimeout(this.searchTimeout);
        this.setState({ searchQuery: e.nativeEvent.text }, () => {
            if (this.state.searchQuery !== '') {
                this.setState({ media: [] }, () => {
                    this.searchTimeout = setTimeout(async () => {
                            let giphyRandomId = '';
                            if (!this.props.giphyId) {
                                giphyRandomId = await generateGiphyUserRandomId();
                            } else {
                                giphyRandomId = this.props.giphyId;
                            }

                            const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);
                            const userLang = getLocaleLanguage();
                            const media = await searchGiphyMedia(giphyRandomId, this.state.searchQuery, mediaType, userLang, MEDIA_TO_LOAD_FROM_GIPHY);

                            this.setState({ media });
                    }, 500);
                });
            } else {
                this.setState({ media: [] }, () => {
                    this.fetchTrendingMedia();
                });
            }
        });
    }

    fetchMoreMedia = async (e) => {
        let giphyRandomId = '';
        if (!this.props.giphyId) {
            giphyRandomId = await generateGiphyUserRandomId();
        } else {
            giphyRandomId = this.props.giphyId;
        }

        const actualMediaCopy = [...this.state.media];
        let newMedia = [];
        if (this.state.searchQuery === '') {
            const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);
            newMedia = await getGiphyTrending(giphyRandomId, mediaType, MEDIA_TO_LOAD_FROM_GIPHY, this.state.media.length);

        } else {
            const userLang = getLocaleLanguage();
            const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);
            newMedia = await searchGiphyMedia(giphyRandomId, this.state.searchQuery, mediaType, userLang, MEDIA_TO_LOAD_FROM_GIPHY, this.state.media.length);
        }

        this.setState({ media: actualMediaCopy.concat(newMedia) });
    }

    renderImage = ({ item }) => {
        if (item.images.fixed_height_small) {
            const ratio = item.images.fixed_height_small.width / item.images.fixed_height_small.height;
            const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('InteractionsConfirmSelection', {
                            selectedMedia: item.images,
                            mediaType,
                            ...this.props.navigation.state.params
                        });
                    }}
                    style={[styles.gridElementContainer, {
                        backgroundColor: mediaType !== GIPHY_STICKERS ? '#202152' : 'transparent'
                    }]}
                >
                    <Image
                        source={{ uri: item.images.fixed_height_small.url }}
                        style={[
                            {
                                aspectRatio: ratio,
                                minWidth: '100%',
                            }
                        ]}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            );
        }
    };

    render() {
        const mediaType = this.props.navigation.getParam('mediaType', GIPHY_GIFS);

        return (
            <View style={styles.container}>
                <View style={[styles.gridMainContainer]} >
                    <View style={styles.gridSearchBarContainer}>
                        <View style={[styles.searchBar, styles.gridSearchBar]}>
                            <View style={{ opacity: 0.4 }}>
                                <images.svg.searchStreamerIcon style={styles.searchIcon} />
                            </View>
                            <TextInput
                                value={this.state.searchQuery}
                                onChange={this.searchHandler}
                                style={styles.gridSearchBarTextInput}
                                placeholder={`${translate('interactions.visual.searchOn')} Giphy`}
                                placeholderTextColor={'#fff3'}
                            />
                        </View>
                        <Image source={images.png.PoweredbyGiphy.img} style={styles.gridPoweredbyGiphy} />
                    </View>
                    <View style={styles.gridMasonryContainer}>
                        <RadMasonry
                            onEndReachedThreshold={0.25}
                            data={this.state.media}
                            numColumns={mediaType === GIPHY_STICKERS ? 3 : 2}
                            renderItem={this.renderImage}
                            onEndReached={this.fetchMoreMedia}
                            containerStyle={styles.gridMasonrySubContainer} />
                    </View>
                </View>
                {/* <View style={styles.gridBottomSectionSelector}>
                    <TouchableOpacity
                        onPress={() => this.setState({ ...this.state, searchQuery: '', gifSection: 0 })}
                        style={[styles.gridBottomSelectionSelectorButton, {
                            backgroundColor: !this.state.gifSection ? '#29326B' : '#0000',
                        }]}
                    >
                        <Text style={[styles.gridBottomSelectionSelectorButtonText, {
                            color: !this.state.gifSection ? '#FFFFFF' : '#FFFFFF99',
                        }]}
                        >
                            {translate('interactions.feed.recents')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ ...this.state, searchQuery: '', gifSection: 1 })}
                        style={[styles.gridBottomSelectionSelectorButton, {
                            backgroundColor: this.state.gifSection ? '#29326B' : '#0000',
                        }]}
                    >
                        <Text style={[styles.gridBottomSelectionSelectorButtonText, {
                            color: this.state.gifSection ? '#FFFFFF' : '#FFFFFF99',
                        }]}
                        >
                            {translate('interactions.visual.tabs.trends')}
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        giphyId: state.userReducer.user.giphyId
    };
}

export default connect(mapStateToProps)(InteractionsGiphyMediaSelector);