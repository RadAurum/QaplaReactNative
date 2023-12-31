// josep.sanahuja - 22-09-2019 - us123 - File creation

import React from 'react';

import {
  View,
  TouchableWithoutFeedback,
  Modal
} from 'react-native'

import styles from './style'
import Images from './../../../assets/images';
import { withNavigation } from 'react-navigation';
import { RNCamera } from 'react-native-camera';

import QGCameraModal from './QGCameraModal/QGCameraModal';
import { translate } from '../../utilities/i18';
import QaplaText from '../QaplaText/QaplaText';

const CloseIcon = Images.svg.closeIcon;

class QGCamera extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pictureTaken: false,
      picture: {uri: "", base64: ""}
    };
  }

  componentDidMount() {
      const { navigation } = this.props;
      this.list = [
        navigation.addListener('willFocus', () =>
         this.setState({
           focusedScreen: true
         })
        ),
        navigation.addListener('willBlur', () =>
         this.setState({ focusedScreen: false })
        )
      ]
  }

  componentWillUnmount() {
    //Remove willBlur and willFocus listeners on navigation
    this.list.forEach((item) => item.remove());
  }

  /**
    * Takes the picture using the RNCamera component and save its content to the state
    * with the uri from the file from Cache and the base64 image conversion.
    */
  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      this.setState({
        pictureTaken: true,
        picture: {uri: data.uri, base64: data.base64}
      });
    }
  };

  /**
    * Saves the picture to the owner of the QGCamera component by passing the uri
    * and the base64 string image. It closes the QGCamera modal at the end.
    */
  savePicture = () => {
    if (this.state.picture.uri != "") {
      this.props.savePicture(this.state.picture);
    }

    this.closeCamera();
  }

  /**
  * Closes the confirmation modal where the user can choose to keep the picture
  * or take another one.
  */
  closeQGCameraModal = () => {
      this.setState({
          pictureTaken: false
      });
  }

  /**
  * Closes the QGCamera modal.
  */
  closeCamera = () => {
      this.props.onClose();
  }

  /**
  * Determines de type of camera.
  *
  * @returns {any} Camera type (front / back)
  */
  getCameraType = () => {
      let res = RNCamera.Constants.Type.back;

      if (this.props.cameraType === "front"){
        res = RNCamera.Constants.Type.front;
      }

      return res;
  }

  render() {
      return (
        <View>
          <Modal
              animationType='fade'
              transparent={false}
              visible={this.props.visible && !this.state.pictureTaken}
              onRequestClose={this.closeCamera}>
                  {this.state.focusedScreen &&
                      <View style={styles.container}>
                          <RNCamera
                            ref={ref => {
                              this.camera = ref;
                            }}
                            style={styles.preview}
                            type={this.getCameraType()}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            captureAudio={false}
                            androidCameraPermissionOptions={{
                              title: translate('qGCamera.androidPermissions.title'),
                              message: translate('qGCamera.androidPermissions.message'),
                              buttonPositive: translate('qGCamera.androidPermissions.buttonPositive'),
                              buttonNegative: translate('qGCamera.androidPermissions.buttonNegative'),
                            }}
                          />
                          <View style={styles.closeIconContainer}>
                              <TouchableWithoutFeedback onPress={this.props.onClose}>
                                  <View style={styles.buttonDimensions}>
                                      <CloseIcon/>
                                  </View>
                              </TouchableWithoutFeedback>
                          </View>
                          <TouchableWithoutFeedback onPress={this.takePicture}>
                              <View style={styles.buttonContainer}>
                                  <QaplaText style={styles.textStyle}>{translate('qGCamera.takePhoto')}</QaplaText>
                              </View>
                          </TouchableWithoutFeedback>
                      </View>
                  }
          </Modal>
          <QGCameraModal
              visible={this.state.pictureTaken}
              pictureUri={this.state.picture.uri}
              savePicture={this.savePicture}
              onClose={this.closeQGCameraModal} />
        </View>
      );
  }
}

export default withNavigation(QGCamera);