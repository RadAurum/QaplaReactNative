import React, { Component } from 'react';
import { Button, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { translate } from '../../utilities/i18';

import styles from './style';

import images from '../../../assets/images';

class UploadContent extends Component {

    state = {
        gifUrl: 'https://media.giphy.com/media/vapO47YjBqpqAdNoAl/giphy.gif',
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => { this.props.navigation.navigate('AddTags'); }}
                >
                    <View style={styles.cardContainer}>
                        <Image
                            source={{ uri: this.state.gifUrl }}
                            style={styles.backgroundImage}
                        />
                        <View style={styles.backgroundAttenuation} />
                        <images.svg.fileUpload />
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitleText}>
                                {translate('uploadContent.uploadScreen.title')}
                            </Text>
                            <Text style={styles.cardSubtitleText}>
                                {translate('uploadContent.uploadScreen.subtitle')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.cardButton}
                            onPress={() => { this.props.navigation.navigate('AddTags'); }}
                        >
                            <Text style={styles.cardTextButton}>
                                {translate('uploadContent.uploadFile')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

export default UploadContent;