import * as firebase from 'firebase';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyDBCB9kPA5NPKDR6gWSwTLbtVyR_9aCAA0",
    authDomain: "reactnativeprueba-8f6f8.firebaseapp.com",
    databaseURL: "https://reactnativeprueba-8f6f8.firebaseio.com",
    projectId: "reactnativeprueba-8f6f8",
    storageBucket: "reactnativeprueba-8f6f8.appspot.com",
    messagingSenderId: "614138734637",
    appId: "1:614138734637:web:7c5772f22f05f8fe"
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();