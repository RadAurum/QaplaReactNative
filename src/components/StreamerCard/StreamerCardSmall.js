import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import Images from '../../../assets/images';
import { getStreamerProfilePhotoUrl } from '../../services/storage';

const FounderBadge = Images.svg.founderBadge;

class StreamerCardSmall extends Component {
    state = {
        imageUrl: this.props.photoUrl,
    };

    getFallbackImage = async () => {
        try {
            this.setState({ imageUrl: await getStreamerProfilePhotoUrl(this.props.streamerId) });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <TouchableOpacity style={[styles.smallCard, { height: this.props.horizontal ? '93.4%' : 'auto' }]}
                onPress={this.props.onPress}>
                {this.props.backgroundUrl ?
                    <Image style={styles.smallCoverImage}
                        source={{ uri: this.props.backgroundUrl }} />
                    :
                    <LinearGradient style={styles.smallCoverImage}
                        useAngle
                        angle={this.props.backgroundGradient.angle}
                        colors={this.props.backgroundGradient.colors} />
                }
                <Image style={styles.smallStreamerImage}
                    source={this.state.imageUrl ? { uri: this.state.imageUrl } : null}
                    onError={this.getFallbackImage} />
                <View style={styles.streamerNameContainer}>
                    <Text style={styles.miniStreamerName}>
                        {this.props.displayName}
                    </Text>
                    <View>
                        {this.props.badge &&
                            <FounderBadge />
                        }
                    </View>
                </View>
                {/* <Text style={styles.bio} numberOfLines={3} ellipsizeMode='tail'>
                    {this.state.bio}
                </Text>
                <View style={styles.tagsContainer}>
                    {this.props.tags && this.props.tags.map(tag => (
                        <QaplaChip style={styles.tags} textStyle={styles.tagText}>
                            {tag}
                        </QaplaChip>
                    ))
                    }
                </View> */}
            </TouchableOpacity>
        );
    }
}

export default StreamerCardSmall;