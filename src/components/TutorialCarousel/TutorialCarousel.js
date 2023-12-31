// diego              - 12-09-2019 - us99 - Added BackIcon
// diego              - 16-08-2019 - us77 - File creation

import React, { Component } from 'react';
import { View, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';

import styles from './style';
import { getDimensions } from '../../utilities/iosAndroidDim';
import Images from './../../../assets/images';

const BackIcon = Images.svg.backIcon;

export class TutorialCarousel extends Component {
    state = {
        selectedIndex: 0
    };

    /**
     * Set the current index to show on the progress icons
     * 
     * @param {object} scrollEvent Event returned from onScroll method of ScrollView
     */
    determineIndexWithScrollPosition = (scrollEvent) => {
        const scrollPosition = scrollEvent.nativeEvent.contentOffset.x;
        this.setState({ selectedIndex: scrollPosition < getDimensions().width / 2 ? 0 : 1 });
    }

    render() {
        return (
            <View style={styles.scrollContainer}>
                <View style={styles.backIconContainer}>
                    <TouchableWithoutFeedback onPress={this.props.backToUploadMatchResultScreen}>
                        <View style={styles.backIcon}>
                            <BackIcon />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView horizontal
                    pagingEnabled
                    disableIntervalMomentum
                    onScroll={this.determineIndexWithScrollPosition}>
                    <View style={styles.carrouselContainer}>
                        {this.props.images.map((image, index) => (
                            <View key={`ClutchTutorialCarouselIndex${index}`}>
                                <Image style={styles.image} source={image}/>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressCircleIndicator, { backgroundColor: this.state.selectedIndex === 0 ? '#6D7DDE' : '#B1B1B1' }]} />
                    <View style={[styles.progressCircleIndicator, { backgroundColor: this.state.selectedIndex === 1 ? '#6D7DDE' : '#B1B1B1' }]} />
                </View>
            </View>
        );
    }
}

export default TutorialCarousel;
