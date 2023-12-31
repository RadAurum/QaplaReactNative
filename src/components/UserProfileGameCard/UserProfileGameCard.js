// diego           - 11-09-2019 - us107 - Updated card margins and game icon size to make
//                                        visible for the user that he can scroll
// diego           - 20-08-2019 - us89 - File creation

import React, { Component } from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import styles from './style';
import AnimatedCircleIndicator from '../AnimatedCircleIndicator/AnimatedCircleIndicator';
import { translate } from '../../utilities/i18';
import Colors from '../../utilities/Colors';
import QaplaText from '../QaplaText/QaplaText';

export class UserProfileGameCard extends Component {
    render() {

        /**
         * lastChild prop indicates if that is the last card, in this case add an extra marginRight
         * to the style, otherwise the last card is going to end at the border of the screen, and
         * that doesn't look good
         */
        return (
            <View style={[styles.container, { marginRight: this.props.lastChild ? 10 : 0 }]}>
                <View style={styles.gameData}>
                    {this.props.game.local ?
                        <this.props.game.icon
                            width={48}
                            height={48} />
                        :
                        <SvgUri
                            width={48}
                            height={48}
                            uri={this.props.game.icon}
                            fill={Colors.greenQapla} />
                    }
                    <QaplaText style={styles.descriptionText}>{this.props.game.name}</QaplaText>
                </View>
                <View style={styles.gamerInfo}>
                    <View style={styles.indicatorContainer}>
                        <AnimatedCircleIndicator fill={this.props.winRate} description='Win Rate' percentage />
                    </View>
                    <View style={styles.indicatorContainer}>
                        <AnimatedCircleIndicator fill={this.props.experience} description='Exp' />
                    </View>
                    <View style={styles.indicatorContainer}>
                        <AnimatedCircleIndicator fill={this.props.level} description={translate('userProfileScreen.userProfileGameCard.level')} />
                    </View>
                </View>
            </View>
        );
    }
}

export default UserProfileGameCard;
