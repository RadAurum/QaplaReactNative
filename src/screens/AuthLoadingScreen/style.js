// josep.sanahuja    - 05-08-2019 - us84 - + sfvContainer

import { StyleSheet } from 'react-native';
import { paddingTopForAndroidDevicesWithNotch } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    sfvContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'#131833',
        paddingTop: paddingTopForAndroidDevicesWithNotch()
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor:'#131833'
    },
    textColor: {
        color: 'rgba(61,249,223,1)',
        alignSelf: 'center',
        fontSize: 20
    }
})
