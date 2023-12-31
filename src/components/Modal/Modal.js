// josep.sanahuja - 22-07-2019 - bug2 - set overlay View as main child

import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './style';
import QaplaText from '../QaplaText/QaplaText';

class Modal extends Component {
    render() {
        return (
            <>
                {this.props.open ?
                    <>
                        <View style={styles.overlay}>
                            <View style={styles.mainContainer}>
                                <View style={styles.container}>
                                    <View style={styles.modalBody}>
                                        <QaplaText style={styles.closeIcon} onPress={this.props.onClose}>X</QaplaText>
                                        {this.props.children}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                    :
                    null
                }
            </>
        );
    }
}

export default Modal;
