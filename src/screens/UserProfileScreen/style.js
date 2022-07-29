import { StyleSheet } from 'react-native'
import { widthPercentageToPx, heightPercentageToPx, getPercentHeight, getPercentWidth, } from '../../utilities/iosAndroidDim'
import Colors from '../../utilities/Colors'

export default styles = StyleSheet.create({
	profileView: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	profileDetailsContainer: {
		marginLeft: 16,
		marginRight: 16,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	qoinsView: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	qoinsImage: {
		height: 45,
		width: 45
	},
	qoinsValue: {
		color: '#FFF',
		fontSize: 36,
		marginLeft: 8
	},
	twitchButtonContainer: {
		backgroundColor: '#8B46FF',
		borderRadius: 20,
		justifyContent: 'center',
		width: widthPercentageToPx(30)
	},
	linkWithTwitchContainer: {
		flexDirection: 'column'
	},
	linkWithTwitchButtonContainer: {
		borderColor: '#8B46FF',
		borderWidth: 2,
		borderRadius: 20,
		justifyContent: 'center',
		marginBottom: 6
	},
	twitchButtonContentContainer: {
		flexDirection: 'row',
		marginLeft: 16,
		marginRight: 16,
		marginTop: 10,
		marginBottom: 10,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	twitchButtonText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FFF',
		marginLeft: 12,
		textAlign: 'center'
	},
	twitchIconButton: {
		marginLeft: 24,
		marginRight: 24,
		marginTop: 10,
		marginBottom: 10
	},
	linkAccountText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FFF',
		textAlign: 'center'
	},
	bitsCardContainer: {
		marginTop: 12,
		marginLeft: 24,
		marginRight: 30,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	bitsModuleView: {
		backgroundColor: 'rgb(59, 75, 249)',
		borderRadius: 20,
		shadowColor: 'rgba(0, 0, 0, 0.25)',
		shadowRadius: 10,
		shadowOpacity: 1,
		marginTop: 16,
		width: widthPercentageToPx(45)
	},
	infoImageContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	infoImage: {
		marginLeft: 12,
		marginTop: 12
	},
	donationValueContainer: {
		marginTop: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	bitsValueContainer: {
		marginLeft: 16,
		marginTop: 12
	},
	bitsNumber: {
		color: '#FFF',
		fontSize: 48
	},
	bitsTitle: {
		color: '#FFF',
		fontSize: 12
	},
	handleDonationContainer: {
		marginRight: 12
	},
	updateDonationIcon: {
		marginTop: 12
	},
	buttonView: {
		backgroundColor: 'rgb(108, 122, 229)',
		borderRadius: 18.5,
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 0,
		marginTop: 18,
		marginLeft: 18,
		marginRight: 18,
		marginBottom: 16
	},
	supportText: {
		color: '#FFF',
		fontSize: 16,
		marginTop: 8,
		marginBottom: 8,
		textAlign: 'center'
	},
	bits3dIconImage: {
		position: 'absolute',
		bottom: -heightPercentageToPx(2.5),
		left: widthPercentageToPx(25)
	},
	levelModalView: {
		alignSelf: 'center',
		justifyContent: 'space-between'
	},
	userImage: {
		resizeMode: 'cover',
		height: 120,
		width: 120
	},
	expTextContainer: {
		alignSelf: 'center',
		borderRadius: 100,
		backgroundColor: '#4040FF',
		position: 'absolute',
		bottom: 0
	},
	expText: {
		color: '#FFF',
		fontSize: 12,
		alignSelf: 'center',
		marginTop: 5,
		marginBottom: 5,
		marginRight: 14,
		marginLeft: 14
	},
	lastSeasonLevelContainer: {
		marginTop: 24,
		borderRadius: 12,
		backgroundColor: '#141539',
		height: heightPercentageToPx(7),
		width: widthPercentageToPx(32),
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 14,
		paddingLeft: 14,
		justifyContent: 'center',
		alignSelf: 'flex-end'
	},
	lastSeasonCopie: {
		fontSize: 12,
		fontWeight: '500',
		color: '#FFF',
		textAlign: 'center'
	},
	seasonLevelContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8
	},
	donationNavigatorContainer: {
		flex: 1,
		marginTop: 36
	},
	storeTitle: {
		fontSize: 22,
		color: '#FFF',
		marginLeft: 24,
		marginBottom: 16
	},
	myQlanTitle: {
		marginTop: 24,
	},
	myQlanContainer: {
		flex: 1,
		backgroundColor: '#141539',
		justifyContent: 'center',
		width: widthPercentageToPx(getPercentWidth(326)),
		height: heightPercentageToPx(getPercentHeight(180)),
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: heightPercentageToPx(getPercentHeight(8)),
		paddingTop: heightPercentageToPx(getPercentHeight(25)),
		paddingBottom: heightPercentageToPx(getPercentHeight(30)),
		borderRadius: heightPercentageToPx(getPercentHeight(20)),
	},
	joinQlanIcon: {
		width: heightPercentageToPx(getPercentHeight(110)),
		height: heightPercentageToPx(getPercentHeight(110)),
	},
	joinQlanTitle: {
		fontSize: heightPercentageToPx(getPercentHeight(22)),
		fontStyle: 'normal',
		fontWeight: '700',
		lineHeight: heightPercentageToPx(getPercentHeight(26)),
		letterSpacing: widthPercentageToPx(getPercentWidth(0.3499999940395355)),
		textAlign: 'center',
		color: '#fff',
		marginTop: heightPercentageToPx(getPercentHeight(-36)),
	},
	joinQlanSubtitle: {
		fontSize: heightPercentageToPx(getPercentHeight(12)),
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: heightPercentageToPx(getPercentHeight(16)),
		textAlign: 'center',
		color: '#fff',
		maxWidth: widthPercentageToPx(getPercentWidth(140)),
		marginTop: heightPercentageToPx(getPercentHeight(3)),
	},
	myQlanJoinedContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	myQlanImageContainer: {
		marginTop: heightPercentageToPx(getPercentHeight(-40)),
		width: heightPercentageToPx(getPercentHeight(280)),
		height: heightPercentageToPx(getPercentHeight(280)),
		marginBottom: heightPercentageToPx(getPercentHeight(-40)),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		paddingRight: widthPercentageToPx(getPercentWidth(16)),
		paddingBottom: heightPercentageToPx(getPercentHeight(44)),
	},
	myQlanImage: {
		width: heightPercentageToPx(getPercentHeight(36)),
		height: 36,
		borderRadius: 100,
		marginRight: widthPercentageToPx(getPercentWidth(8)),
	},
	myQlanText: {
		fontSize: heightPercentageToPx(getPercentHeight(18)),
		fontStyle: 'normal',
		fontWeight: '700',
		lineHeight: heightPercentageToPx(getPercentHeight(26)),
		letterSpacing: widthPercentageToPx(getPercentWidth(0.3499999940395355)),
		textAlign: 'center',
		color: '#fff',
	},
	updateText: {
		fontSize: heightPercentageToPx(getPercentHeight(12)),
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: heightPercentageToPx(getPercentHeight(28)),
		marginLeft: widthPercentageToPx(getPercentWidth(4)),
	},
	updateContainer: {
		position: 'absolute',
		top: 34,
		right: 26,
	},
	updateInnerContainer: {
		flexDirection: 'row',
		width: 90,
		height: 28,
		justifyContent: 'center',
	},
	updateIconContainer:
	{
		justifyContent: 'center',
	},
	invisible: {
		opacity: 0,
	},
});