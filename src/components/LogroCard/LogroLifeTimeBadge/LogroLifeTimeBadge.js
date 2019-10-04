import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './style';
import { ONE_HOUR_MILISECONDS, HOURS_IN_DAY } from './../../../utilities/Constants';

export class LogroLifeTimeBadge extends Component {
    render() {
        const dayObject = new Date();
        
        /**
         * The date come from the cards in the next format:
         * Day-Month-Year
         * So we need to split between the "-" to get the data, because
         * the original format is not valide to create a date object
         */
        const [day, month, year] = this.props.limitDate.split('-');
        const logroEndDate = new Date(`${month}/${day}/${year}`);
        const currentDate = new Date(
            `${dayObject.getUTCMonth() + 1}/${dayObject.getUTCDate()}/${dayObject.getUTCFullYear()} ${dayObject.getUTCHours()}:${dayObject.getUTCMinutes()}`
        );

        let leftHours = (logroEndDate.getTime() - currentDate.getTime()) / ONE_HOUR_MILISECONDS;
        const remainingDays = Math.round(leftHours / HOURS_IN_DAY);
        const remainingHours = Math.round(leftHours - (remainingDays * HOURS_IN_DAY));

        return (
            <View style={styles.timeLifeBadge}>
                {remainingDays > 0 ?
                    <Text style={styles.timeLife}>
                        {`${remainingDays}d ${remainingHours}h`}
                    </Text>
                    :
                    remainingDays === 0 &&
                    <Text style={styles.timeLife}>
                        {`${remainingHours}h`}
                    </Text>
                }
            </View>
        );
    }
}

export default LogroLifeTimeBadge;
