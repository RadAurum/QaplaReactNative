import { StyleSheet } from 'react-native';
import Colors from '../../utilities/Colors';

import { heightPercentageToPx, widthPercentageToPx, getPercentHeight, getPercentWidth } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    sfvContainer: {
        flex: 1,
        backgroundColor: '#0D1021',
        paddingBottom: 0,
    },
    closeBackIcon: {
        marginHorizontal: widthPercentageToPx(getPercentWidth(16)),
        marginTop: heightPercentageToPx(getPercentHeight(28))
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
    },
    qaplaLogo: {
        marginTop: heightPercentageToPx(getPercentHeight(14)),
        resizeMode: 'contain',
        width: widthPercentageToPx(getPercentWidth(128)),
        height: heightPercentageToPx(getPercentHeight(68)),
    },
    card: {
        flex: 1,
        justifyContent: 'space-around',
        width: widthPercentageToPx(100),
        marginTop: heightPercentageToPx(getPercentHeight(32)),
        borderTopLeftRadius: heightPercentageToPx(getPercentHeight(40)),
        borderTopRightRadius: heightPercentageToPx(getPercentHeight(40)),
        alignItems: 'center',
    },
    titleAndDescriptionContainer: {
        marginTop: heightPercentageToPx(getPercentHeight(32)),
        width: widthPercentageToPx(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: heightPercentageToPx(getPercentHeight(30)),
        color: '#FFF',
        textAlign: 'center',
        width: widthPercentageToPx(70),
    },
    description: {
        fontWeight: '600',
        marginTop: heightPercentageToPx(getPercentHeight(24)),
        maxWidth: widthPercentageToPx(70),
        fontSize: heightPercentageToPx(getPercentHeight(22)),
        color: '#FFF',
        textAlign: 'center',
        alignSelf: 'center',
    },
    emailButtonContainer: {
        width: widthPercentageToPx(100),
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: heightPercentageToPx(getPercentHeight(32)),
    },
    emailButton: {
        marginRight: widthPercentageToPx(getPercentWidth(12)),
        fontSize: heightPercentageToPx(getPercentHeight(14)),
        color: 'rgba(255, 255, 255, .8)',
        textAlign: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailFormContainer: {
        paddingTop: heightPercentageToPx(getPercentHeight(24)),
        maxWidth: widthPercentageToPx(100),
    },
    usernameContainer: {
        marginTop: heightPercentageToPx(getPercentHeight(16)),
        maxWidth: widthPercentageToPx(100),
    },
    button: {
        fontWeight: '600',
        backgroundColor: '#00FFDD',
        width: widthPercentageToPx(69.33),
        height: heightPercentageToPx(getPercentHeight(74)),
        borderRadius: heightPercentageToPx(getPercentHeight(36)),
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonTextContainer: {
        width: widthPercentageToPx(70),
        alignSelf: 'center',
    },
    buttonWithIconContainer: {
        width: widthPercentageToPx(69.33),
        height: heightPercentageToPx(getPercentHeight(74)),
        borderRadius: heightPercentageToPx(getPercentHeight(36)),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: heightPercentageToPx(getPercentHeight(17)),
        textAlign: 'center',
    },
    iOSAuthOptionsContainer: {
        marginTop: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: widthPercentageToPx(33),
        height: heightPercentageToPx(getPercentHeight(74)),
        marginBottom: 30
    },
    checkBox: {
        marginTop: heightPercentageToPx(getPercentHeight(16)),
    },
    errorMessage: {
        fontSize: heightPercentageToPx(getPercentHeight(12)),
        color: '#FFF',
    },
    termsAndConditionsText: {
        flexDirection: 'row',
        fontSize: heightPercentageToPx(getPercentHeight(14)),
        lineHeight: heightPercentageToPx(getPercentHeight(21)),
        color: '#FFF',
        textAlignVertical: 'center',
        justifyContent: 'space-between',
        width: widthPercentageToPx(70),
        textAlign: 'center',
    },
    hyperlinkText: {
        color: '#3df9df',
        fontWeight: 'bold',
    },
    dotStepsContainer: {
        marginBottom: heightPercentageToPx(getPercentHeight(24)),
        flexDirection: 'row',
        alignSelf: 'center',
        height: heightPercentageToPx(getPercentHeight(8)),
    },
    skipButtonContainer: {
        marginTop: heightPercentageToPx(getPercentHeight(28)),
        marginHorizontal: widthPercentageToPx(getPercentWidth(16)),
        alignSelf: 'flex-end',
        borderRadius: 100,
        backgroundColor: 'rgba(64, 64, 255, 0.3)',
        height: heightPercentageToPx(getPercentHeight(40)),
    },
    skipButtonText: {
        marginHorizontal: widthPercentageToPx(getPercentWidth(12)),
        marginVertical: heightPercentageToPx(getPercentHeight(9)),
        fontSize: heightPercentageToPx(getPercentHeight(16)),
        textAlign: 'center',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, .65)'
    },
    qlanImage: {
        width: heightPercentageToPx(getPercentHeight(225)),
        height: heightPercentageToPx(getPercentHeight(225)),
        marginTop: heightPercentageToPx(getPercentHeight(80)),
        marginBottom: heightPercentageToPx(getPercentHeight(-175)),
        justifyContent: 'center',
        paddingRight: widthPercentageToPx(getPercentWidth(10)),
        paddingBottom: widthPercentageToPx(getPercentWidth(32)),
        zIndex: 10,
    },
    qlanImageText: {
        color: '#fff',
        fontSize: heightPercentageToPx(getPercentHeight(24)),
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: heightPercentageToPx(getPercentHeight(30)),
        letterSpacing: widthPercentageToPx(getPercentWidth(-0.7200000286102295)),
        textAlign: 'center',
    },
    qlanSubtitle: {
        color: '#fff',
        fontSize: heightPercentageToPx(getPercentHeight(18)),
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: heightPercentageToPx(getPercentHeight(26)),
        letterSpacing: widthPercentageToPx(getPercentWidth(0.3499999940395355)),
        textAlign: 'center',
        width: widthPercentageToPx(69.33),
        marginTop: heightPercentageToPx(getPercentHeight(-10)),
        marginBottom: heightPercentageToPx(getPercentHeight(12)),
    },
    tickCircleGlow: {
        height: widthPercentageToPx(getPercentWidth(120)),
        width: widthPercentageToPx(getPercentWidth(120)),
        marginTop: heightPercentageToPx(getPercentHeight(50)),
    },
    modalText: {
        fontSize: heightPercentageToPx(getPercentHeight(24)),
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: heightPercentageToPx(getPercentHeight(30)),
        textAlign: 'center',
        color: '#fff',
        maxWidth: widthPercentageToPx(getPercentWidth(210)),
        marginTop: heightPercentageToPx(getPercentHeight(-24)),
        marginBottom: heightPercentageToPx(getPercentHeight(26)),
    },
    qaplaColor: {
        color: Colors.greenQapla,
    },
    confirmModalSubtitle: {
        fontSize: heightPercentageToPx(getPercentHeight(16)),
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: heightPercentageToPx(getPercentHeight(22)),
        letterSpacing: widthPercentageToPx(getPercentWidth(0.2545454502105713)),
        textAlign: 'center',
        color: '#fff',
        width: widthPercentageToPx(69.33),
    },
    twitchAuthScreenContainer: {
        width: '100%',
        height: '100%'
    },
    boldConfirmModalSubtitle: {
        fontWeight: '700'
    }
});