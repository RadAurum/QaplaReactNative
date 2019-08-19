// diego          - 14-08-2019 - us77 - Added uploadResultOfMatch
// josep.sanahuja - 14-08-2019 - bug6 - - .credits from numQaploins
// josep.sanahuja - 13-08-2019 - us86 - + isMatchAlreadyChallenged
// josep.sanahuja - 08-08-2019 - us85 - + deleteNotification
// diego          - 06-08-2019 - us75 - Add matchesPlayRef
// diego          - 05-08-2019 - us60 - Add declineMatch logic
// diego          - 01-08-2019 - us58 - Add logic to load info for notifications
// diego          - 29-07-2019 - us55 - challengeUser method added
// diego          - 16-07-2019 - us34 - Substract of qaploins logic implemented
// diego          - 16-07-2019 - Create createPublicMatch and bug fixed on addGameToUser
// diego          - 15-07-2019 - Create commissionRef and getCurrentQaplaCommission
// diego          - 11-07-2019 - Update getGamerTagWithUID and addGameToUser functions 
// josep.sanahuja - 08-07-2019 - us83 - Removed navigation from 'createUserName'
//                                      for new references on database and errors detecrted on addGameToUser
// josep.sanahuja - 08-07-2019 - us83 - Removed navigation from 'createUserName'

import { database, TimeStamp } from "../utilities/firebase";
import { randomString } from "../utilities/utils";

export const matchesRef = database.ref('/Matches');
export const matchesPlayRef = database.ref('/MatchesPlay');
export const usersRef = database.ref('/Users');
export const gamesRef = database.ref('/Games');
export const commissionRef = database.ref('/Commission');

/**
 * Returns the userName of the specified user
 * @param {string} Uid User id from firebase
 */
export async function getUserNameWithUID(Uid) {
    try {
        const userNameSnap = await usersRef.child(Uid).child('userName').once('value');
        return userNameSnap.val();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Description: Returns the gamerTag of the specified user and the game and
 * platform of the current match. There are some platforms that share the same gamerTag,
 * therefore, in this code in the function this fact is checked (ps4white, xbox_white).
 *
 * @param {string} Uid User id from firebase
 * @param {string} game Name of the game of the current match
 * @param {string} platform Name of the platform of the current match
 *
 * TODO (12-09-2019): Move the logic that checks if all games from a platform share
 * the same gamertag into a cloud function that basically returns the gamertag.
 */
export async function getGamerTagWithUID(Uid, game, platform) {
    return await usersRef.child(Uid).child('gamerTags').once('value').then((data) =>
    {
        if (data.exists()) {
            switch (platform) {
                case 'pc_white':
                    if (game === 'aClash') {
                        return {
                            gamerTag: data.val().clashTag != null ? data.val().clashTag : null
                        }
                    } else if (game === 'pcLol'){
                        return {
                            gamerTag: data.val().lolTag != null ? data.val().lolTag : null
                        }
                    } else if (game === 'pHearth' || game === 'pOver'){
                        return {
                            gamerTag: data.val().battlenet != null ? data.val().battlenet : null
                        }
                    }
                    break;
                case 'ps4_white':
                    return {
                        gamerTag: data.val().psn != null ? data.val().psn : null
                    }
                case 'xbox_white':
                    return {
                        gamerTag: data.val().xboxLive != null ? data.val().xboxLive : null
                    }
                case 'switch_white':
                    return {
                        gamerTag: data.val().NintendoID != null ? data.val().NintendoID : null
                    }
                default:
                    break;
            }
        } else {
            return { gamerTag: null };
        }
    });
}

export function createUserProfile(Uid, email) {
    usersRef.child(Uid).set({
        bio: '',
        captain: 'false',
        city: '',
        country: 'Mexico',
        credits: 0,
        discordTag: '',
        email,
        experience: 0,
        id: Uid,
        level: 0,
        losses: 0,
        penalty: '',
        phoneNumber: '',
        photoUrl: '',
        searching: '',
        status: false,
        token: '',
        userName: '',
        wins: 0
    });
}

/**
 * Update the userName of specific user only if that username is not already in use
 * @param {string} uid User identifier of the user on firebase
 * @param {string} userName The name that the user want to use in Qapla
 * 
 * Return: {boolean} user was created or otherwise it was not
 */
export async function createUserName(uid, userName) {
    return await usersRef.orderByChild('city').equalTo(userName.toUpperCase()).once('value').then(async (userNameAlready) => {
        if (!userNameAlready.exists()) {
            await usersRef.child(uid).update({ userName, city: userName.toUpperCase() });
             
            // #us83: Removed return navigation.navigate('Retas'); and replace it with a boolean value
            //.so that it can be consumed by others. Removing the navigation method complies with
            // trying to decouple as much as possible what each method does. This one, creates a UserName
            // in to the database, we delegate navigation to others.
            return true;
        } else {
            // The username is already being used
            return false;
        }
    });
}

/**
 * Function to add the game and gamertag of a user
 * @param {string} uid User identifier from database
 * @param {string} platform Platform to add gamertag (one of: pc, xbox, ps4, switch)
 * @param {string} gameKey Key of the game to add
 * @param {string} gamerTag Tag of the user (the user must insert this value)
 */
export async function addGameToUser(uid, platform, gameKey, gamerTag) {
    const gameList = await usersRef.child(uid).child('gameList').once('value').then((gameList) => gameList);
    if (gameList.exists()) {
        var userAlreadyHaveThisGame = false;
        gameList.forEach((game) => {
            if (game.val() === gameKey) {
                userAlreadyHaveThisGame = true;
            }
        });
        if (userAlreadyHaveThisGame) {
            return Promise.resolve({ message: 'El usuario ya tiene este juego agregado' });
        }
        await usersRef.child(uid).child('gameList').child(gameList.numChildren()).set(gameKey);
    } else {
        console.log("[addGameToUser] : gameKey2 :  " + gameKey);
        await usersRef.child(uid).child('gameList').child(0).set(gameKey);
    }
    var gamerTagChildNode = {};
    switch (platform) {
        case 'pc_white':
            if (gameKey === 'aClash') {
                gamerTagChildNode = {key: 'clashTag', value: gamerTag};
            } else if (gameKey === 'pcLol'){
                gamerTagChildNode = {key: 'lolTag', value: gamerTag};
            } else if (gameKey === 'pHearth' || game === 'pOver'){
                gamerTagChildNode = {key: 'battlenet', value: gamerTag};
            }
            break;
        case 'ps4_white':
            gamerTagChildNode = {key: 'psn', value: gamerTag};
            break;
        case 'xbox_white':
            gamerTagChildNode = {key: 'xboxLive', value: gamerTag};
            break;
        case 'switch_white':
            gamerTagChildNode = {key: 'NintendoID', value: gamerTag};
            break;
        default:
            break;
    }
    if ((await getGamerTagWithUID(uid, gameKey, platform).then((gamerTag) => gamerTag.gamerTag)) == null) {
        await usersRef.child(uid).child('gamerTags').child(gamerTagChildNode.key).set(gamerTagChildNode.value);
    }
    return Promise.resolve({ message: 'Juego agregado correctamente' });
}

/**
 * Get the current commission that qapla set for each match
 */
export async function getCurrentQaplaCommission() {
    try {
        return await commissionRef.once('value').then((commission) => commission.val());
    } catch (error) {
        console.error(error);
    }
}

/**
 * Create a public match
 * @param {string} uid INPUT user identifier of the match creator
 * @param {number} bet INPUT bet of the match
 * @param {string} game INPUT gameKey of the game selected to play
 */
export async function createPublicMatch(uid, bet, game) {
    try {
        const dateObject = new Date();
        const hour = dateObject.getUTCHours() < 10 ? '0' + dateObject.getUTCHours() : dateObject.getUTCHours();
        const minutes = dateObject.getUTCMinutes() < 10 ? '0' + dateObject.getUTCMinutes() : dateObject.getUTCMinutes();
        const date = dateObject.getUTCDate() < 10 ? '0' + dateObject.getUTCDate() : dateObject.getUTCDate();
        const month = dateObject.getUTCMonth()+1 < 10 ? '0' + (dateObject.getUTCMonth()+1) : (dateObject.getUTCMonth()+1);
        const matchObject = {
            adversary1: uid,
            adversary2: '',
            alphaNumericIdMatch: randomString(),
            bet,
            date: `${date}/${month}`,
            game: game.gameKey,
            hora: parseFloat(hour+minutes/100),
            hour: `${hour}:${minutes}`,
            hourResult: '',
            numMatches: '1',
            observations: '',
            pickResult1: '',
            pickResult2: '',
            platform: game.platform,
            resultPlay1: '0',
            resultPlay2: '0',
            timeStamp: TimeStamp,
            // winBet is the bet multiplied x2 cause must be the sum of the bet of the two adversary's
            winBet: bet*2
        };
        const createdMatch = await matchesRef.push(matchObject);
        await matchesRef.child(createdMatch.key).update({ idMatch: createdMatch.key });
        return createdMatch.key;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Remove the specified quantity of qaploins from a user
 * @param {string} uid INPUT user identifier to substract the qaploins
 * @param {number} currentCredits INPUT The current number of qaploins of the user
 * @param {number} quantityToSubstract INPUT The amount of qaploins to substract
 */
export async function substractQaploinsToUser(uid, currentCredits, quantityToSubstract) {
    try {
        return await usersRef.child(uid).update({ credits: currentCredits - quantityToSubstract});
    } catch (error) {
        console.error(error);
    }
}

/**
 * Return the URL of the given user
 * @param {string} uid user identifier from firebase
 */
export async function getProfileImageWithUID(uid) {
    try {
        const photoUrlSnap = await usersRef.child(uid).child('photoUrl').once('value');
        return photoUrlSnap.val();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Get the game name based on the matchId
 * @param {string} matchId Match identifier in the database
 */
export async function getGameNameOfMatch(matchId) {
    try {
        let game = 'Juego no encontrado';
        const gameKeySnap = await matchesRef.child(matchId).child('game').once('value');
        const gameKey = gameKeySnap.val();
        const platformSnap = await matchesRef.child(matchId).child('platform').once('value');

        switch(platformSnap.val()) {
            case 'pc_white':
                if (gameKey === 'aClash') {
                    game = 'Clash Royale';
                } else if (gameKey === 'pcLol') {
                    game = 'LOL';
                } else if (gameKey === 'pHearth') {
                    game = 'Hearthstone';
                } else if (gameKey === 'pOver') {
                    game = 'Overwatch';
                }
                break;
            case 'ps4_white':
                if (gameKey === 'psFifa') {
                    game = 'FIFA 19';
                } else if (gameKey === 'psOver') {
                    game = 'Overwatch';
                }
                break;
            case 'switch_white':
                    if (gameKey === 'swSmash') {
                        game = 'Smash brothers';
                    }
                break;
            case 'xbox_white':
                if (gameKey === 'xFifa') {
                    game = 'FIFA 19';
                } else if (gameKey === 'xGears') {
                    game = 'Gears of War';
                } else if (gameKey === 'xHalo') {
                    game = 'Halo';
                } else if (gameKey === 'xOver') {
                    game = 'Overwatch';
                }
                break;
            default: 
                break;
        }
        return game;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Return the data of a match
 * @param {string} matchId Identifier of the match in the database
 */
export async function getMatchWitMatchId(matchId) {
    try {
        const matchSnap = await matchesRef.child(matchId).once('value');
        return matchSnap.val();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Notify to the creator of the match that an user wants to challenge him
 * @param {string} uidMatchCreator INPUT The user identifier of the user who has created the match
 * @param {string} uidMatchChallenger INPUT The user identifier of the user who wants to challenge the match
 * @param {string} idMatch INPUT The identifier of the match
 */
export async function challengeUser(uidMatchCreator, uidMatchChallenger, idMatch) {
    try {
        return await usersRef.child(uidMatchCreator).child('notificationMatch').push({
            idEquipo: '',
            idMatch,
            idUserSend: uidMatchChallenger,
            type: 'reta',
            userName: await getUserNameWithUID(uidMatchChallenger)
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description Decline a proposal of match
 * @param {string} uid User id of the user who decline the match
 * @param {string} notificationId Id of the notification
 */
export async function declineMatch(uid, notificationId) {
    try {
        /*
            Decline a match only implies delete the notification from the notificationMatch node
            of the user who receives it (challenged user)
        */
        return await deleteNotification(uid, notificationId);
    } catch (error) {
        console.error(error);
    }
}

// -----------------------------------------------
// Notifications
// -----------------------------------------------

/**
 * @description Delete a notification with notificationId
 * @param {string} uid User id of the user who decline the match
 * @param {string} notificationId Id of the notification
 */
export async function deleteNotification(uid, notificationId) {
    try {
        return await usersRef.child(uid).child('notificationMatch').child(notificationId).remove();
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description 
 * Checks if a challenge notification for a match created by a particular user already exists.
 *
 * @param {string} matchCreatorUid    User id of the user who created the match
 * @param {string} matchChallengerUid User id of the user who challenges the match
 * @param {string} matchId            Id of the match
 */
export async function isMatchAlreadyChallenged(matchCreatorUid, matchChallengerUid, matchId) 
{
    let res = false;

    try {
        // Retrieve the notificationMatch Node with its childs ordered by order considering 
        // the idUserSend. Why idUserSend? Because it's much more efficient to order by 
        // idUsersend rather than matchId. Reason to say much more efficient is that the 
        // ChallengedUser might have several notifications for a match 'A', whereas it will
        // have much more fewer notifications from the ChallengerUser.
        notArrSnap = await usersRef.child(matchCreatorUid).child('notificationMatch').orderByChild('idUserSend').equalTo(matchChallengerUid).once('value');
        notArr = notArrSnap.val();
        
        if (notArr !== null && notArr !== undefined) {
            
            // Object.keys returns an array of keys from the notArr. The method 'some' compares and returns
            // true as soon as the comparison produces 'true', otherwise it will keep iterating until the end.
            res = Object.keys(notArr).some((key) => {

                // notArr is an Object that contains multiple properties with the value of an uuid of
                // a notification, which each have their onw properties as an Object. Therefore the
                // notArr[key] operation to access the Object, and .matchId to access the prop. from the
                // notification Object.
                return notArr[key].idMatch === matchId;
            });
        }
    } catch (error) {
        console.error(error);
    }
    console.log("Res is: " + res);
    return res;
}



// -----------------------------------------------
// Qaploins
// -----------------------------------------------

/**
 * @description
 * Check that a user has >= Qaploins than the match bet.
 *
 * @param {string}  idUserSend  Id of the user that challenged a match
 * @param {string}  matchId     Id of the match consulted
 *
 */
export async function userHasQaploinsToPlayMatch(idUserSend, matchId) {
    try {
        let numQaploinsSnap = await usersRef.child(idUserSend).child('credits').once('value');
        let numQaploins = numQaploinsSnap.val();

        let matchBetSnap = await matchesRef.child(matchId).child('bet').once('value');
        let matchBet = matchBetSnap.val();

        return numQaploins >= matchBet;
    } catch (error) {
        console.error(error);
    }
}

// -----------------------------------------------
// Matches
// -----------------------------------------------

/**
 * @description Upload the result of a match from the current user
 * @param {string} idMatch Identifier of the match on database
 * @param {number} adversary Indicates if the user is the adversary1 or the adversary2
 * @param {enum} result 1 for won, 0 for lost, 7 for other
 * @param {string} evidence url of the clutch evidence
 */
export async function uploadMatchResult(idMatch, adversary, result, evidence) {
    const dateObject = new Date();

    // If the current hour is less than 10, for example 1, we add a 0 to make looks like 01
    const hour = dateObject.getUTCHours() < 10 ? '0' + dateObject.getUTCHours() : dateObject.getUTCHours();

    // If the current minute is less than 10, for example 1, we add a 0 to make looks like 01
    const minutes = dateObject.getUTCMinutes() < 10 ? '0' + dateObject.getUTCMinutes() : dateObject.getUTCMinutes();
    const hourResult = `${hour}:${minutes}`;

    // Check what adversary is trying to upload the result, for add the data in the correct childs
    if (adversary === 1) {
        matchesPlayRef.child(idMatch).update({ resultPlay1: result, pickResult1: '1', hourResult, clutch1: evidence });
    } else if (adversary === 2) {
        matchesPlayRef.child(idMatch).update({ resultPlay2: result, pickResult2: '1', hourResult, clutch2: evidence });
    }
}