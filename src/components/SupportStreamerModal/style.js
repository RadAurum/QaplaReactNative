import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    mainContainer: {
		flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: widthPercentageToPx(100),
        height: heightPercentageToPx(100),
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    blurContainer: {
        width: widthPercentageToPx(100),
        height: heightPercentageToPx(100)
    },
    cardContainer: {
        width: widthPercentageToPx(100),
        position: 'absolute',
        bottom: 0
    },
    card: {
        backgroundColor: '#0D1022',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        height: heightPercentageToPx(62),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    supportAmountContainer: {
        width: widthPercentageToPx(26.7),
        height: heightPercentageToPx(11),
        marginRight: 14,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    supportAmount: {
        fontSize: 26,
        fontWeight: '800',
        textShadowRadius: 20,
        marginRight: 8
    },
    title: {
        maxWidth: '80%',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -.72,
        marginBottom: 48,
        color: '#FFF',
        textAlign: 'center'
    },
    greenText: {
        color: '#00FFDC'
    },
    descriptionContainer: {
        marginTop: 20,
        paddingRight: 42,
        paddingLeft: 42
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 22,
        textAlign: 'center',
        letterSpacing: .25,
        color: '#FFF'
    },
    sendCheersButton: {
        backgroundColor: '#00FFDC',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: widthPercentageToPx(100),
        height: heightPercentageToPx(11),
        justifyContent: 'center'
    },
    sendCheersText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0D1022',
        letterSpacing: .5,
        textAlign: 'center'
    }
});