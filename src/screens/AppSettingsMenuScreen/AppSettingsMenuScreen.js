// josep.sanahuja  - 13-11-2019 - us147 - File creation

import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, SafeAreaView, Image } from 'react-native';
import styles from './style';
import Images from './../../../assets/images';
import { connect } from 'react-redux';

import AddDiscordTagModal from '../../components/AddDiscordTagModal/AddDiscordTagModal';

const QaplaAppIcon = Images.png.qaplaAppIcon.img;

class AppSettingsMenuScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            discordModalOpen: false
        };
    }

    goToSupport = () => {
        this.props.navigation.navigate('Support');
    }

    toggleDiscordModal = () => {
        this.setState({
            discordModalOpen: !this.state.discordModalOpen
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.sfvContainer}>
                <View style={styles.container}>
                    <Text style={styles.headerText}>Configuración</Text>
                    <Image style={styles.mainImage}
                        source={QaplaAppIcon} />  
                    <Text style={styles.littleText}>{this.props.userName}</Text>  
                    
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuHeaderText}> CONFIGURACIÓN </Text>
                    </View> 
                    <TouchableWithoutFeedback onPress={this.goToSupport}>
                        <View style={styles.menuItemRow}>
                            <Text style={styles.menuItemRowText}> Soporte </Text>
                        </View>
                    </TouchableWithoutFeedback>    
                    <TouchableWithoutFeedback onPress={this.toggleDiscordModal}>
                        <View style={styles.menuItemRow}>
                            <Text style={styles.menuItemRowText}> Editar Discord </Text>
                        </View>
                    </TouchableWithoutFeedback> 
                </View>
                <AddDiscordTagModal
                    open={this.state.discordModalOpen}
                    onClose={this.toggleDiscordModal} />
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        userName: state.userReducer.user.userName
    }
}

export default connect(mapStateToProps)(AppSettingsMenuScreen);
