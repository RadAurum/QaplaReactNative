import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1021',
        paddingBottom: 0,

        alignContent: 'center'
    },
    backIcon: {
        position: 'absolute',
        top: 32,
        left: 16
    },
    scrollView: {
        width: widthPercentageToPx(100),
        maxHeight: heightPercentageToPx(55)
    },
    reactionSample: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: widthPercentageToPx(100),
        marginBottom: heightPercentageToPx(12)
    },
    animationGif: {
        maxHeight: heightPercentageToPx(25),
        maxWidth: widthPercentageToPx(94)
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    steps: {
        borderRadius: 100,
        backgroundColor: '#00FEDF',
        height: 8,
        width: 8
    },
    modal: {
        paddingTop: 32,
        paddingBottom: 32,
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '100%'
    },
    modalTextContainer: {
        maxWidth: '75%',
        height: heightPercentageToPx(20)
    },
    modalTextTitle: {
        fontSize: 20,
        letterSpacing: -0.41,
        textAlign: 'center',
        fontWeight: '700',
        color: '#FFF'
    },
    modalTextDescription: {
        marginTop: 16,
        fontSize: 18,
        letterSpacing: -0.41,
        lineHeight: 21.48,
        textAlign: 'center',
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)'
    },
    button: {
        borderRadius: 40,
        backgroundColor: '#00FFDD',
        paddingTop: 26,
        paddingBottom: 26,
        width: '66%'
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.49,
        textAlign: 'center',
        color: '#0D1021'
    }
});