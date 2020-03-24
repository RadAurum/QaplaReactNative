// josep.sanahuja  - 05-01-2020 - us187 - Standardized margins for CloseIcon and backIcon
// josep.sanahuja  - 18-12-2019 - us177 - Add resendContainer && resendtext
// diego           - 18-09-2019 - us119 - File creation

import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx, paddingTopForAndroidDevicesWithNotch } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    sfvContainer: {
        flex: 1,
        backgroundColor: '#0d1021',
        paddingTop: paddingTopForAndroidDevicesWithNotch()
    },
    backAndCloseOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backIconContainer: {
        alignSelf: 'flex-end'
    },
    closeIconContainer: {
        alignSelf: 'flex-end'
    },
    scrollViewContainer: {
        height: heightPercentageToPx(60)
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: heightPercentageToPx(.25)
    },
    buttonResendScenario: {
        marginBottom: heightPercentageToPx(2),
        borderRadius: 100,
        backgroundColor: '#FA2D79',
        alignSelf: 'center'
    },
    button: {
        marginTop: heightPercentageToPx(10),
        marginBottom: heightPercentageToPx(2),
        borderRadius: 100,
        backgroundColor: '#FA2D79',
        alignSelf: 'center'
    },
    buttonText: {
        color: '#FFF',
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: heightPercentageToPx(2),
        marginBottom: heightPercentageToPx(2),
        marginLeft: widthPercentageToPx(10),
        marginRight: widthPercentageToPx(10),
        textAlign: 'center',
        letterSpacing: .57
    },
    smsWarning: {
        fontSize: 10,
        color: '#FFF',
        textAlign: 'center'
    }
});
