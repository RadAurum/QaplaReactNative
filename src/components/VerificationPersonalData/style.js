// diego           - 18-09-2019 - us119 - File creation

import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor:'#131833',
        marginLeft: widthPercentageToPx(4),
        marginRight: widthPercentageToPx(4),
        width: widthPercentageToPx(100)
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        width: widthPercentageToPx(80)
    },
    divider: {
        marginTop: heightPercentageToPx(2.5)
    },
    userDataForm: {
        marginTop: heightPercentageToPx(4),
        justifyContent: 'space-between',
        marginLeft: widthPercentageToPx(6),
        marginRight: widthPercentageToPx(12),
        height: heightPercentageToPx(44)
    },
    qaplaTextInput: {
        backgroundColor: '#11152D',
        height: heightPercentageToPx(8),
        borderBottomColor: '#6D7DDE',
        color: '#FFF',
        borderRadius: 4,
        borderBottomWidth: 2
    }
});