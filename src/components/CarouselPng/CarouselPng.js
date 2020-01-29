// diego	  	  - 03-09-2019 - us92 - Update carousel according to inVision design

import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';

import Images from './../../../assets/images';
import { styles } from './style';
import { widthPercentageToPx } from '../../utilities/iosAndroidDim';

const Divider = Images.png.divider.img;

class CarouselPng extends Component {
    state = {
        currentIndex: 0,
        userHasFinishedCarousel: false
    };

    makeAutomaticScroll = () => {
        if (!this.state.userHasFinishedCarousel) {

            /**
             * Once the user (or the timeout callback) has scrolled to the end of the Carousel we disable the scroll
             */
            if (this.state.currentIndex === this.props.carrouselData.length - 1) {
                this.setState({ userHasFinishedCarousel: true });
            }

            this.changeSlideTimeout = setTimeout(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                    this.scrollView.scrollTo({ x: widthPercentageToPx(100) * (this.state.currentIndex) });
                });
            }, 5000);
        }
    }

    componentDidMount() {
        this.makeAutomaticScroll();
	}

    onScrollEnd = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);

        /**
         * Disable the automatic scroll if the user returns to a previous slide, this user behavior can mean
         * that he wants to read something again or he has not enough time to read a slide the first time
         * so we do not what to cause the same problem again.
         * ONLY Do this once we ensure that all the users can reach the final slide of the carousel
         * at this moment we have a report from a user with a Xiaomi Redmi note 8 pro, Android 9, this user
         * can not see the last screen and we are not able to reproduce this error, so do not do this validation yet
         */

        clearTimeout(this.changeSlideTimeout);
        this.setState({ currentIndex: pageNum }, this.makeAutomaticScroll);
        this.props.setCurrentIndex(pageNum);
    }

    render() {
        return (
            <ScrollView
                ref={(scrollView) => this.scrollView = scrollView}
                horizontal
                pagingEnabled
                disableIntervalMomentum
                onScroll={this.onScrollEnd}
                showsHorizontalScrollIndicator={false}>
                {this.props.carrouselData.map((slide, index) => (
                    <View key={`OnBoardingImages${index}`} style={styles.flatListContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={slide.Image}/>
                        </View>
                        <Text style={styles.title}>{slide.title}</Text>
                        <Image style={styles.divider} source={Divider} />
                        <Text style={styles.description}>{slide.description}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }
}

export default CarouselPng;