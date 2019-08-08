// josep.sanahuja - 05-08-2019 - us84 - + sfvContainer
// josep.sanahuja - 08-07-2019 - us83 - + inputTextTaken

import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
    sfvContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'#131833'
    },
    container: {
        flex:1,
        backgroundColor:'#131833',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formContainer: {
        marginLeft: 30,
        marginRight: 30
    },
    title: {
        color: '#FFF',
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold'
    },
    inputText: {
        marginTop: 14,
        borderRadius: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    inputTextTaken: {
        marginTop: 14,
        borderRadius: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'red'
    },
    buttonContainer: {
        borderRadius: 100,
        backgroundColor: '#FA2D79',
        paddingVertical: 16,
        paddingHorizontal: 40,
        marginTop: 50
    },
    buttonText: {
        color: '#FFF',
        alignSelf: 'center'
    },
    backgroundImage: {
        flex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: -1,
        opacity: .68,
        width: '100%',
        height: '50%'
    }
});