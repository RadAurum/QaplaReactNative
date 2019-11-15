// diego                - 02-09-2019 - us91 - Added setUserIdOnSegment on different signins
// diego                - 24-07-2019 - us31 - removed unnecessary code from
//                                          getIdTokenFromUser function
import { auth, FBProvider, GoogleProvider } from './../utilities/firebase';
import { createUserProfile } from './database';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import {GoogleSignin} from 'react-native-google-signin';
import { setUserIdOnSegment } from './statistics';
import store from './../store/store';
import { signOutUser } from '../actions/userActions';

const webClientIdForGoogleAuth = '66587586976-m04tjhp3or1f2c27jd5pvh2m3vf9cq4b.apps.googleusercontent.com';

export function signInWithFacebook(navigation) {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
    .then((result) => {
        if (result.isCancelled) {
            console.log('Facebook authentication cancelled');
        } else {
            AccessToken.getCurrentAccessToken()
            .then((data) => {
                const credential = FBProvider.credential(data.accessToken)
                auth.signInWithCredential(credential)
                .then((user) => {
                    setUserIdOnSegment(user.user.uid);

                    if (user.additionalUserInfo.isNewUser) {
                        createUserProfile(user.user.uid, user.user.email);
                        navigation.navigate('ChooseUserNameScreen', { uid: user.user.uid });
                    } else {
                        navigation.pop();
                    }
                }).catch((error) => {
                    console.log('ERROR:',error);
                });
            });
        }
    });
}

export function signInWithGoogle(navigation) {
    GoogleSignin.signIn()
    .then((user) => {
        const credential = GoogleProvider.credential(user.idToken, user.accessToken);
        auth.signInWithCredential(credential)
        .then((user) => {
            setUserIdOnSegment(user.user.uid);

            if (user.additionalUserInfo.isNewUser) {
                createUserProfile(user.user.uid, user.user.email);
                navigation.navigate('ChooseUserNameScreen', { uid: user.user.uid });
            } else {
                navigation.pop();
            }
        }).catch((error) => {
            console.log('ERROR:',error);
        });
    })
    .catch((err) => {
        console.log(err);
    })
    .done();
}

export function setupGoogleSignin() {
    try {
      GoogleSignin.configure({
        webClientId: webClientIdForGoogleAuth,
        offlineAccess: false
      });
    }
    catch (err) {
      console.log("Google signin error", err.code, err.message);
    }
}

export function signInWithEmailAndPassword(email, password) {
    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
        console.log(user.user.uid);
        setUserIdOnSegment(user.user.uid);
        //Do something with the user data
    })
    .catch((error) => {
        console.log(error.code, error.message);
    });
}

/**
 * Send a SMS to the given number of the user to verify their phone number
 * @param {string} phoneNumber Phone number of the user
 */
export async function sendVerificationSMSToUser(phoneNumber) {

    /**
     * https://rnfirebase.io/docs/v5.x.x/auth/reference/auth#verifyPhoneNumber
     */
    return await auth.verifyPhoneNumber(phoneNumber, false, true);
}

/**
 * Link the current account of the user with the new cellphone account
 * @param {object} phoneCredential Phone credentials of firebase auth
 */
export async function linkUserAccountWithPhone(phoneCredential) {
    return await auth.currentUser.linkWithCredential(phoneCredential);
}

export function isUserLogged() {
    return auth.currentUser !== null;
}

export async function getIdTokenFromUser() {
    try {
        return await auth.currentUser.getIdToken(true);
    } catch(error) {
        console.log('Error: ', error);
    }
}

/**
 * Close the sesion of the user (just on auth, don't remove
 * data from redux)
 */
export async function signOut() {
    try {
        await auth.signOut();
        store.dispatch(signOutUser());
    } catch (error) {
        console.error(error);
    }
}