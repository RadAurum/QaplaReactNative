import React, { Component } from 'react';
import { View, Image, Text, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styles from './style';
import images from '../../../assets/images';
import { widthPercentageToPx, heightPercentageToPx, getScreenSizeMultiplier } from '../../utilities/iosAndroidDim'

class InteractionsPersonalize extends Component {

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

    render() {
        return (
            <View style={[styles.container, {
                paddingHorizontal: 16 * getScreenSizeMultiplier(),
                paddingTop: 32 * getScreenSizeMultiplier(),
            }]}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: '600',
                        lineHeight: 32,
                    }}>
                        {'Personaliza tu interacción'}
                    </Text>
                    <TouchableOpacity style={{
                        backgroundColor: '#22272F',
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                    }}>
                        <images.svg.questionMark />
                    </TouchableOpacity>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginTop: 8,
                }}>
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
                    <TouchableOpacity
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
                    </TouchableOpacity>
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
                    <TouchableOpacity
                        onPress={() => console.log('e')}
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
                    </TouchableOpacity>
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
                    <TouchableOpacity
                        onPress={() => console.log('d')}
                        style={styles.personalizeButtonContainer}
                    >
                        <ImageBackground
                            source={images.png.InteractionGradient5.img}
                            style={styles.personalizeButtonBackgroundImage}
                        >
                            {/* <View style={styles.personalizeButtonIconContainer}>
                                <images.svg.interactionsTtGiphy />
                            </View> */}
                            <Text style={[styles.personalizeButtonIconText,
                            {
                                maxWidth: 110 * getScreenSizeMultiplier(),
                                height: 75 * getScreenSizeMultiplier(),
                                marginTop: 0,
                                textAlignVertical: 'center',
                            }]} >
                                Enviar sólo
                                Qoins, desde:
                            </Text>
                            <View style={styles.personalizeButtonDisplayQoinsContainer}>
                                <images.svg.qoin style={styles.qoin} />
                                <Text style={styles.personalizeButtonDisplayQoinsText}>
                                    {this.state.OnlyQoins}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <View style={{
                    display: 'flex',
                    flexGrow: 1,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity style={{
                        display: 'flex',
                        alignSelf: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}>
                        <Text style={{
                            color: '#FFFFFF99',
                            fontSize: 16,
                            fontWeight: '500',
                            lineHeight: 28,
                            letterSpacing: 1,
                        }}>
                            {'Sólo enviar' + ' '}
                            <Text style={{ color: '#FFFFFF' }}>
                                Qoins
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

export default InteractionsPersonalize;