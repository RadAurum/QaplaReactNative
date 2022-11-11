import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1021'
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24
    },
    textButton: {
        padding: 4
    },
    textButtonText: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: .49,
        color: 'rgba(255, 255, 255, 0.65)'
    },
    containedButton: {
        paddingHorizontal: 27,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#00FFDD'
    },
    containedButtonDisabled: {
        opacity: 0.4
    },
    containedButtonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -.32,
        color: '#0D1021'
    },
    ttsContainer: {
        flexDirection: 'row',
        marginLeft: 16,
        width: widthPercentageToPx(20)
    },
    avatarImage: {
        borderRadius: heightPercentageToPx(100),
        width: widthPercentageToPx(11),
        height: widthPercentageToPx(11),
        marginRight: 8
    },
    ttsInputContainer: {
        justifyContent: 'flex-start',
        // 100 - 11 (avatar image) - 8 (marginRight) - 16 (ttsContainer)
        width: widthPercentageToPx(89) - 24 - 16
    },
    ttsTextInput: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '400',
        textAlignVertical: 'top',
        padding: 0
    },
    optional: {
        fontSize: 10,
        fontWeight: '400',
        lineHeight: 12,
        color: '#7BB0FF'
    },
    mediaContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 8
    },
    removeImageIcon: {
        position: 'absolute',
        top: 8,
        right: 8
    },
    streamerAndExtraTipsContainer: {
        overflow: 'hidden',
        paddingHorizontal: 16
    },
    streamerContainer: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    streamerAvatar: {
        marginLeft: 8,
        marginRight: 8,
        height: 32,
        width: 32,
        borderRadius: 1000
    },
    costContainer: {
        backgroundColor: '#1C1E64',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    costText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: .5,
        color: '#FFF'
    },
    extraTipButtonsContainer: {
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    extraTipOptionButtonContainer: {
        height: widthPercentageToPx(21.33),
        width: widthPercentageToPx(21.33),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    extraTipOptionButton: {
        height: widthPercentageToPx(19.66),
        width: widthPercentageToPx(19.66),
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    extraTipOptionButtonText: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF'
    },
    mediaSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#141539'
    },
    mediaSelectorScrollView: {
        /**
         * Every icon button inside the scroll view has a width of 48 (24 width and 24 padding).
         * To always show 4 or 5 (depending on screen size) and a half icons we just do:
         * 48 * (4 or 5) - 24 = 264 (width * 6 - (width / 2))
         * (we want to show half icon to give a visual hint to the user, so he know he can scroll
         * through options)
         */
        maxWidth: widthPercentageToPx(100) <= 360 ? 216 : 264,
        height: '100%',
        marginRight: 30
    },
    tooltipContainer: {
        minHeight: 150,
        padding: 16,
        flex: 1,
        justifyContent: 'space-between'
    },
    tooltipTextAndIconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    tooltipLabelText: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 19,
        color: '#FFF'
    },
    tooltipHighlihgtedText: {
        color: '#00FFDD'
    },
    tooltipButtonContainer: {
        flexDirection: 'row',
        backgroundColor: '#141735',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 19,
        paddingVertical: 13,
        borderRadius: 50,
        marginTop: 11,
        alignSelf: 'flex-end',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 22
    },
    tooltipArrowStyle: {
        color: '#3B4BF9'
    },
    tooltipArrowSize: {
        height: 14,
        width: 30
    },
    tooltipContentStyle: {
        backgroundColor: '#3B4BF9',
        width: widthPercentageToPx(83.75),
        borderRadius: 15
    },
    mediaOptionContainer: {
        paddingHorizontal: 12
    },
    mediaOptionDisabled: {
        opacity: 0.4
    },
    extraTipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    extraTipButtonText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: -.32,
        color: '#FFF'
    }
});