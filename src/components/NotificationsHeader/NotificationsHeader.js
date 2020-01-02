// diego             - 12-09-2019 - us99 - Updated closeIcon (changed text icon for SVG icon)
// diego 			 - 01-08-2019 - us58 - File creation

import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

import styles from './style';
import Images from './../../../assets/images';

const CloseIcon = Images.svg.closeIcon;

class NotificationsHeader extends Component {

    /**
     * Close the notification tab when it's called
     */
    closeNotifications = () => {
        this.props.navigation.pop();
    }

    render() {
        return (
            <SafeAreaView style={styles.sfvContainer}>
    	        <View style={styles.container}>
    	            <Text style={styles.title}>Notificaciones</Text>
                    <TouchableWithoutFeedback onPress={this.closeNotifications}>
                        <View style={styles.closeIcon}>
                            <CloseIcon />
                        </View>
                    </TouchableWithoutFeedback>
    	        </View>
            </SafeAreaView>
        );
    }
}

export default NotificationsHeader;
