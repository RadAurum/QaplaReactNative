// diego -          01-08-2019 - us58 - Navigation implemented to notificationRouter
// josep.sanahuja    - 30-07-2019 - us59 - + navigate('Mock2')

import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback 
} from 'react-native';
import { styles } from './style';
import { connect } from 'react-redux';
import images from './../../../assets/images';

import HighlightModal from '../HighlightModal/HighlightModal';

import { storeData, retrieveData } from '../../utilities/persistance';
import { HIGHLIGHT_2_NOTIFICATIONS } from '../../utilities/Constants';

const NotificationIcon = images.svg.notificationIcon;

class HeaderBar extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            showHg2Modal: false
        };
    }

    componentDidMount() {
        //storeData(HIGHLIGHT_2_NOTIFICATIONS, 'true');
        this.checkHighlightsFlags();
    }

    shouldComponentUpdate(nextProp, nextState) {
        //console.log("muuuuuuuu " + JSON.stringify(nextProp, null, 2));
        // check the hg1 modal flag
        if (nextProp.hg1CreateMatch && !this.props.hg1CreateMatch) {
            this.checkHighlightsFlags();
        }
        else if(nextProp.hg1CreateMatch === false) {
          console.log("[shouldComponentUpdate] : false");
        }
        else {
          console.log("[shouldComponentUpdate] : other");
        }

        return true;
    }

    /**
     * @description
     * Perform a serie of function calls after match creation button is pressed.
     */
    onNotiPressBttn = () => {
        
        // If showHg1Modal is enabled then
        if (this.state.showHg2Modal){
            // Mark the HIGHLIGHT_1_CREATE_MATCH flag, that means, that it has been used
            // and it should not show up again.
            this.markHg2();
            
            console.log('Miau 1: this.state.showHg2Modal' + this.state.showHg2Modal);
            // Hide HIGHLIGHT_1_CREATE_MATCH Modal
            this.toggleHg2Modal();

            console.log('Miau 2: this.state.showHg2Modal' + this.state.showHg2Modal);
        }

        console.log("Main Miau");

        this.props.navigation.navigate('Notifications');
    }

    /**
     * @description 
     * Checks Highlights flags stored in AsyncStorage, and evaluates which flags
     * to activate in the component state.
     *
     * TODO Josep Maria 25-08-2019:
     * When adding more highlights in the same screen, think a way to synchronize
     * them via logic in the same screen or may be add that logic to the HighlightModal
     * component which does not make sense right now.
     */
    async checkHighlightsFlags() {
        try {
            // Get the value for the highlight flag stored in AsynStorage.
            const value = await retrieveData(HIGHLIGHT_2_NOTIFICATIONS);

            //const hgCreateReta = await retrieveData(HIGHLIGHT_1_CREATE_MATCH);
            //const hgCreateReta = false;
            //if (value !== null && !JSON.parse(this.hgCreateReta)) {
            if (value !== null && this.props.hg1CreateMatch) {
                console.log('marra != null: ' + value);
                // There is data stored for the flag, it can be either 'false' or 'true'.
                this.setState({
                    showHg2Modal: JSON.parse(value)
                });
            }
            else {
                console.log('marra === null: ' + value);
                // That means there is no value stored for the flag, therefore
                // result should be 'true', meaning the highlight will activate.
                //if (!JSON.parse(hgCreateReta)) {
                if (this.props.hg1CreateMatch) {
                    this.setState({
                        showHg2Modal: true
                    });
                }
                
            }
        } catch (error) {
          // Error retrieving flag data
          console.log("[HeaderBar] {checkHighlightsFlags} - error retrieving flag data : " + value);
        }
    }

    /**
     * @description 
     * Toggles the flag 'showHg2Modal' in the component state. If value is 'true' then it becomes
     * 'false'. If it is 'false' then it becomes 'true'.
     *
     * TODO: Consider in a future and be aware of toggle instead of a setTrue or setFalse mecanism. 
     */
    toggleHg2Modal = () => {
        this.setState({
            showHg2Modal: !this.state.showHg2Modal
        })
    }

    /**
     * @description 
     * Mark the Highlight flag 'HIGHLIGHT_1_CREATE_MATCH' that indicates
     * a highlight for rName of specific user only if that username is not already in use.
     * Flag is stored in AsyncStorage
     */
    markHg2 = async () => {
        storeData(HIGHLIGHT_2_NOTIFICATIONS, 'false');
    }

    render() {
        const {navigate} = this.props.navigation;
        
        return (
            <View style={styles.container} testID='container'>
                <HighlightModal 
                    visible={this.state.showHg2Modal}
                    onClose={this.toggleHg2Modal}
                    showDelay={1000}
                    cb1={this.markHg2}
                    header='Ve tus Notificaciones'
                    body='Tus retas recibirán notificaciones de desafio, recuerda checar las notificaciones!'>
                    <View style={styles.imageContainer}>
                        <TouchableWithoutFeedback style={styles.imageAndButtonDimensions}
                            onPress={this.onNotiPressBttn}
                            testID='NotificationButton'>
                            <View>
                                <NotificationIcon height={24} width={24} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </HighlightModal>
                <View style={styles.textContainer} testID='textContainer'>
                    <Text style={styles.textStyle} testID='text'>Qapla</Text>
                </View>
                <View style={styles.invisibleView} testID='invisibleView'></View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        hg1CreateMatch: state.highlightsReducer.hg1CreateMatch
    }
}

export default connect(mapStateToProps)(HeaderBar);