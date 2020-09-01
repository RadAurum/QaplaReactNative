import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, TouchableOpacity, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import styles from './style';
import QaplaText from '../QaplaText/QaplaText';
import Images from '../../../assets/images';
import { SHEET_MAX_HEIGHT, SHEET_MIDDLE_HEIGHT, SHEET_MIN_HEIGHT } from '../../utilities/Constants';
import Hearts from '../UserProfileRewards/Hearts';
import ProgressBar from '../UserProfileRewards/Bar';
import Colors from '../../utilities/Colors';

class RewardsBottomSheet extends Component {
    fall = new Animated.Value(1);
    state = {
        open: false
    };

    toggleBottomSheet = () => {
        if (Platform.OS === 'android') {
            if (!this.state.open) {
                this.sheetRef.snapTo(2);
            } else {
                this.sheetRef.snapTo(0);
            }

            this.setState({ open: !this.state.open });
        }
    }

    renderContent = () => {
        return (
            <TouchableWithoutFeedback onPress={this.toggleBottomSheet}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' ?
                        <View style={styles.topBar}/>
                        :
                        !this.state.open ?
                            <Images.svg.arrowDownIcon style={styles.openIcon} fill='#FFF' />
                            :
                            <Images.svg.arrowDownIcon style={styles.closeIcon} fill='#FFF' />
                    }
                    <View style={styles.rewardsInfoContainer}>
                        <View style={styles.row}>
                            <Images.svg.rewardIcon />
                            <View style={styles.rewardsProgressContainer}>
                                <View style={styles.rewardsHeaderContainer}>
                                    <View style={styles.row}>
                                        <QaplaText style={styles.rewardsTitle}>
                                            Reward
                                        </QaplaText>
                                        <Images.svg.infoIcon style={styles.infoIcon} />
                                    </View>
                                    <Images.svg.lifeIcon height={24} width={24} color='rgba(255, 255, 255, .25)' />
                                </View>
                                <View style={styles.progress}>
                                    <ProgressBar
                                        unfilledColor='rgba(255, 255, 255, .25)'
                                        progress={this.props.rewards.currentPoints/10}
                                        color={Colors.greenQapla}
                                        borderWidth={0} />
                                    <View style={styles.rewardsHeaderContainer}>
                                        <View style={styles.lifesContainer}>
                                            <Hearts hearts={this.props.rewards.lifes} />
                                        </View>
                                        <QaplaText style={styles.currentPoints}>
                                            {this.props.rewards.currentPoints}/10
                                        </QaplaText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.transactionsContainer}>
                            <QaplaText style={styles.transactionsTitle}>
                                Transactions
                            </QaplaText>
                            <View style={styles.transactionsSummary}>
                                <View style={styles.transactionsSummaryDescriptions}>
                                    <QaplaText style={styles.transactionDescription}>
                                        Donation
                                    </QaplaText>
                                    <QaplaText style={styles.transactionDescription}>
                                        Donation
                                    </QaplaText>
                                    <QaplaText style={styles.transactionDescription}>
                                        Reward reedemed
                                    </QaplaText>
                                </View>
                                <View style={styles.transactionSummaryValue}>
                                    <QaplaText style={styles.transactionValue}>
                                        {this.props.rewards.donations && this.props.rewards.donations.bits ? this.props.rewards.donations.bits : 0}
                                    </QaplaText>
                                    <QaplaText style={styles.transactionValue}>
                                        {this.props.rewards.donations && this.props.rewards.donations.stars ? this.props.rewards.donations.stars : 0}
                                    </QaplaText>
                                    <QaplaText style={styles.transactionValue}>
                                        {this.props.rewards.rewardsReedemed ? this.props.rewards.rewardsReedemed : 0}
                                    </QaplaText>
                                </View>
                                <View style={styles.transactionSummaryValue}>
                                    <Images.svg.donatedBitIcon
                                        color='#FFF'
                                        style={styles.transactionIcon} />
                                    <Images.svg.donatedStarIcon
                                        color='#FFF'
                                        style={styles.transactionIcon} />
                                    <Images.svg.lifeIcon
                                        color='#FFF'
                                        style={styles.transactionIcon}
                                        height={14}
                                        width={14} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.redeemButtonContainer}>
                        <QaplaText style={styles.redeemButtonText}>
                            Redeem Prize
                        </QaplaText>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <>
                <Animated.View style={{ flex: 1, opacity: Animated.add(0.1, Animated.multiply(this.fall, 1)) }}>
                    {this.props.children}
                </Animated.View>
                <BottomSheet
                    ref={(ref) => this.sheetRef = ref}
                    snapPoints={[SHEET_MIN_HEIGHT, SHEET_MIDDLE_HEIGHT, SHEET_MAX_HEIGHT]}
                    borderRadius={20}
                    callbackNode={this.fall}
                    renderContent={this.renderContent} />
            </>
        );
    }
}

RewardsBottomSheet.defaultProps = {
    rewards: {
        currentPoints: 0,
        lifes: 0,
        donations: {
            bits: 0,
            stars: 0
        },
        rewardsReedemed: 0
    }
};

export default RewardsBottomSheet;
