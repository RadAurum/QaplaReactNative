import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { translate } from '../../utilities/i18';
import styles from './style';
import images from '../../../assets/images';

class InteractionsAddVisual extends Component {

    state = {
        GIFCost: 100,
        StickerCost: 100,
        ClipsCost: 200,
        TTSCost: 200,
        MemeCost: 100,
        OnlyQoins: 50,
    }

    gifs = () => {
        this.props.navigation.navigate('InteractionsSelectGIF', { cost: this.state.GIFCost, type: 0, messageCost: this.state.TTSCost });
    }

    onlyTTS = () => {
        this.props.navigation.navigate('InteractionsCheckout', { hideBackButton: true });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerConatiner}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.whiteText, styles.screenHeaderText, styles.headerMaxWidth]}>
                            {`${translate('interactions.addVisual.addVisual')}`}
                        </Text>
                        {/* <TouchableOpacity style={styles.helpButton}>
                            <images.svg.questionMark />
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.personalizeButtonsContainer}>
                        <TouchableOpacity
                            onPress={this.gifs}
                            style={styles.personalizeButtonContainer}
                        >
                            <ImageBackground
                                source={images.png.InteractionGradient1.img}
                                style={styles.personalizeButtonBackgroundImage}
                            >
                                <View style={styles.personalizeButtonIconContainer}>
                                    <images.svg.interactionsGIF />
                                </View>
                                <Text style={styles.personalizeButtonIconText} >
                                    GIFs
                                </Text>
                                <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                    <images.svg.qoin style={styles.qoin} />
                                    <Text style={styles.personalizeButtonDisplayQoinsText}>
                                        {this.state.GIFCost}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => console.log('b')}
                            style={styles.personalizeButtonContainer}
                        >
                            <ImageBackground
                                source={images.png.InteractionGradient4.img}
                                style={styles.personalizeButtonBackgroundImage}
                            >
                                <View style={styles.personalizeButtonIconContainer}>
                                    <images.svg.interactionsSticker />
                                </View>
                                <Text style={styles.personalizeButtonIconText} >
                                    Sticker
                                </Text>
                                <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                    <images.svg.qoin style={styles.qoin} />
                                    <Text style={styles.personalizeButtonDisplayQoinsText}>
                                        {this.state.StickerCost}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            onPress={() => console.log('c')}
                            style={styles.personalizeButtonContainer}
                        >
                            <ImageBackground
                                source={images.png.InteractionGradient2.img}
                                style={styles.personalizeButtonBackgroundImage}
                            >
                                <View style={styles.personalizeButtonIconContainer}>
                                    <images.svg.interactionsClip />
                                </View>
                                <Text style={styles.personalizeButtonIconText} >
                                    Clips
                                </Text>
                                <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                    <images.svg.qoin style={styles.qoin} />
                                    <Text style={styles.personalizeButtonDisplayQoinsText}>
                                        {this.state.ClipsCost}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity> */}
                        {/* <TouchableOpacity
                        onPress={() => console.log('d')}
                        style={styles.personalizeButtonContainer}
                    >
                        <ImageBackground
                            source={images.png.InteractionGradient5.img}
                            style={styles.personalizeButtonBackgroundImage}
                        >
                            <View style={styles.personalizeButtonIconContainer}>
                                <images.svg.interactionsTtGiphy />
                            </View>
                            <Text style={styles.personalizeButtonIconText} >
                                Texto Giphy
                            </Text>
                            <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                <images.svg.qoin style={styles.qoin} />
                                <Text style={styles.personalizeButtonDisplayQoinsText}>
                                    {'50'}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity> */}
                        {/* <TouchableOpacity
                            onPress={this.tts}
                            style={styles.personalizeButtonContainer}
                        >
                            <ImageBackground
                                source={images.png.InteractionGradient3.img}
                                style={styles.personalizeButtonBackgroundImage}
                            >
                                <View style={styles.personalizeButtonIconContainer}>
                                    <images.svg.interactionsTTS />
                                </View>
                                <Text style={styles.personalizeButtonIconText} >
                                    Text-to-Speech
                                </Text>
                                <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                    <images.svg.qoin style={styles.qoin} />
                                    <Text style={styles.personalizeButtonDisplayQoinsText}>
                                        {this.state.TTSCost}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={() => console.log('f')}
                            style={styles.personalizeButtonContainer}
                        >
                            <ImageBackground
                                source={images.png.InteractionGradient6.img}
                                style={styles.personalizeButtonBackgroundImage}
                            >
                                <View style={styles.personalizeButtonIconContainer}>
                                    <images.svg.interactionsMemes />
                                </View>
                                <Text style={styles.personalizeButtonIconText} >
                                    Memes
                                </Text>
                                <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                    <images.svg.qoin style={styles.qoin} />
                                    <Text style={styles.personalizeButtonDisplayQoinsText}>
                                        {this.state.MemeCost}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.onlySendQoinsContainer}>
                    <TouchableOpacity style={styles.onlySendQoinsTouchable}
                        onPress={this.onlyTTS}
                    >
                        <Text style={[styles.semitransparentText, styles.onlySendQoinsText]}>
                            {`${translate('interactions.addTTS.onlySendMy')} `}
                            <Text style={styles.whiteText}>
                                TTS
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

export default InteractionsAddVisual;