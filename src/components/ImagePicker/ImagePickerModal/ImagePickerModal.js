// josep.sanahuja - 13-08-2019 - us86 - File creation

import React, { Component } from 'react';
import { 
	View,
	Text,
	Modal,
	TouchableWithoutFeedback,
	SafeAreaView
} from 'react-native';

import styles from './style';
import ImagePicker from '../ImagePicker';

class ImagePickerModal extends Component {
	/**
	 *	Callbacks used in render()
	 */

	/**
	 * Description:
	 * Perform a series of actions for the Modal, including the main one which is 'closing the modal'.
	 * The other actions are performed via cb1 and cb2 props, which are executed sequentially, cb1 1st,
	 * cb2 2nd, and they are executed in a synchronous way.
	 * 
	 * @param None
	 */
    action = async () => {
    	// Close the Modal
    	this.closeModal();

    	// cb1 executes before cb2, and in case cb1 is not defined and cb2 is, then cb2 is excecuted
    	// even though cb1 is undefined.
    	if (this.props.cb1 != undefined && this.props.cb1 != null){
    		await this.props.cb1();	
    	}

    	if (this.props.cb2 != undefined && this.props.cb2 != null){
    		await this.props.cb2();
    	}
    }

    closeModal = async () => {
    	// Close the Modal
    	this.props.onClose();
    }

    saveImage = (picture) => {
    	console.log('This is the picture Obj: ' + JSON.stringify(picture, null, 2));
    	this.props.saveImage(picture);
    	this.props.onClose();
  	}

    render() {
        return (
	        	<Modal
					animationType="slide"
					transparent={false}
					visible={this.props.visible}
					onRequestClose={this.props.onClose}>
					<SafeAreaView style={styles.sfvContainer}>
					<ImagePicker
						saveImage={this.saveImage} 
						selectImgBttnTxt={'Quiero esta foto!'}
						discardImgBttnTxt={'No quiero esta foto'}
					/> 
					</SafeAreaView>
		        </Modal>
        );
    }
}

export default ImagePickerModal;
