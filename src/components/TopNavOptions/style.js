// josep.sanahuja  - 05-01-2020 - us187 - Standarized margins for CloseIcon and BackIcon
// diego           - 03-09-2019 - us96 - File creation

import { StyleSheet } from 'react-native';
import { paddingTopForAndroidDevicesWithNotch } from '../../utilities/iosAndroidDim';
import Colors from '../../utilities/Colors';

export default styles = StyleSheet.create({
    sfvContainer: {
        justifyContent: 'center',
        backgroundColor: Colors.backgroundColor,
        paddingTop: paddingTopForAndroidDevicesWithNotch()
    },
    sfvContainerSignInWithEmail: {
        justifyContent: 'center',
        backgroundColor: '#131833',
        paddingTop: paddingTopForAndroidDevicesWithNotch()
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backIconContainer: {
        alignSelf: 'flex-end'
    },
    closeIconContainer: {
        alignSelf: 'flex-end'
    }
});
