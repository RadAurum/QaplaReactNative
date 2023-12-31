import { StyleSheet } from 'react-native';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim'

export default StyleSheet.create({
 sfvContainer: {
   flex: 1,
   backgroundColor: '#0D1021'
 },
 container: {
     flex: 1,
     justifyContent: 'flex-start',
     alignItems: 'center'
 },
 title: {
     color: '#FFF',
     fontSize: 25,
     fontWeight: 'bold',
     marginTop: heightPercentageToPx(30),
     marginBottom: widthPercentageToPx(10)
 },
 description: {
     color: '#FFF',
     fontSize: 16,
     fontWeight: 'normal',
     width: '85%',
     marginBottom: widthPercentageToPx(7)
 },
 bttnContainer: {
    borderRadius: 100,
    backgroundColor: '#FA2D79',
    elevation: 10,
    alignSelf: 'center',
 },
 closeIcon: {
     alignSelf: 'flex-end'
 },
 bttnText: {
     color: '#FFF',
     alignSelf: 'center',
     fontWeight: 'bold',
     marginTop: heightPercentageToPx(2.46),
     marginBottom: heightPercentageToPx(2.46),
     marginLeft: widthPercentageToPx(8.53),
     marginRight: widthPercentageToPx(8.53),
     letterSpacing: .57
 }
});