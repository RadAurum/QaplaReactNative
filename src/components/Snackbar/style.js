import { StyleSheet } from 'react-native';
import { widthPercentageToPx, heightPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 4,
        backgroundColor: '#0e1222',
        shadowColor: '#000',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        position: 'absolute',
        alignSelf: 'center',
        width: widthPercentageToPx(85),
        height: heightPercentageToPx(12)
    },
    message: {
        fontSize: 14,
        color: '#FFF',
        textAlignVertical: 'center',
        marginRight: 16,
        marginLeft: 16
    },
    messageWithAction: {
        fontSize: 14,
        color: '#FFF',
        textAlignVertical: 'center',
        maxWidth: '65%',
        marginRight: 16,
        marginLeft: 16
    },
    actionTextButton: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#36E5CE',
        textAlignVertical: 'center',
        marginRight: 8,
        marginLeft: 8
    }
});