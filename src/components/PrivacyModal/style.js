// josep.sanahuja          - 05-01-2020 - us187 - Standarized marginRight & marginTop for CloseIcon
// josep-sanahuja          - 21-12-2019 - us152 - File creation

import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx, paddingTopForAndroidDevicesWithNotch } from '../../utilities/iosAndroidDim';
import {
    NAV_TOPBAR_ICON_RIGHT_MARGIN,
    NAV_TOPBAR_ICON_TOP_MARGIN
} from '../../utilities/Constants';

export default styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#141833',
        width: widthPercentageToPx(100),
        height: heightPercentageToPx(100),
        ...Platform.select({
          ios: {
            paddingTop: 80
          },
          android: {
            paddingTop: paddingTopForAndroidDevicesWithNotch()
          }
        }),    
    },
    container: {
        width: widthPercentageToPx(100),
        alignSelf: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#141833',
        alignItems: 'center'
    },
    textContainer: {
        width: widthPercentageToPx(90),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: heightPercentageToPx(5),
    },
    closeIcon: {
        marginRight: widthPercentageToPx(NAV_TOPBAR_ICON_RIGHT_MARGIN),
        marginBottom: heightPercentageToPx(2.46),
        marginTop: heightPercentageToPx(NAV_TOPBAR_ICON_TOP_MARGIN),
        alignSelf: 'flex-end'
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 24,
        maxWidth: widthPercentageToPx(70),
    },
    lineText: {
        color: '#FFF'
    },
    lastChild: {
        paddingTop: heightPercentageToPx(20)
    }
});