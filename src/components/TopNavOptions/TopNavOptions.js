// diego           - 03-09-2019 - us96 - File creation

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableWithoutFeedback } from 'react-native';

import styles from './style';
import Images from './../../../assets/images';

const BackIcon = Images.svg.backIcon;
const CloseIcon = Images.svg.closeIcon;

export class TopNavOptions extends Component {
    render() {
        return (
            <SafeAreaView style={styles.sfvcontainer}>
                <View style={styles.optionsContainer}>
                    <View style={styles.backIconContainer}>
                        {this.props.back &&
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.pop()}>
                                <View style={styles.buttonDimensions}>
                                    <BackIcon />
                                </View>
                            </TouchableWithoutFeedback>
                        }
                    </View>
                    <View style={styles.closeIconContainer}>
                        {this.props.close &&
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate(this.props.onCloseGoTo)}>
                                <View style={styles.buttonDimensions}>
                                    <CloseIcon />
                                </View>
                            </TouchableWithoutFeedback>
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default TopNavOptions;
