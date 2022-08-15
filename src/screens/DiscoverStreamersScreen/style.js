import { StyleSheet } from 'react-native';

import Colors from '../../utilities/Colors';
import { heightPercentageToPx, widthPercentageToPx } from '../../utilities/iosAndroidDim';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    searchBar: {
        height: heightPercentageToPx(4.92),
        width: widthPercentageToPx(91.46),
        flexDirection: 'row',
        marginRight: 10,
        borderRadius: 50,
        paddingHorizontal: widthPercentageToPx(4.8),
        alignSelf: 'center',
        alignItems: 'center',
    },
    streamerSearchBar: {
        backgroundColor: '#141539',
    },
    gridSearchBarTextInput: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        color: '#fff',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 1,
        textAlignVertical: 'center',
        paddingLeft: 12
    },
});