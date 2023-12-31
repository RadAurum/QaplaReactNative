import {functions} from '../utilities/firebase'

/**
 * @deprecated
 * Accept challenge for idMatch
 * @param {object} notificationObj Notification object from the challenge request
 * @param {string} idChallenged    uid from the user that receives the challenge request
 *
 * josep.sanahuja - us85: Removed auth.currentUser.uid and include it as parameter 'idChallenged',
 * this avoids dependencies between files and allows a more natural use of the method
 * by passing the info needed as argument.
 */
export function acceptChallengeRequest(notificationObj, idChallenged) {
	return callCloudFunction({
		cfName: 'acceptChallengeRequest',
		params: {
			notificationObj,
			idChallenged
		}
	})
}

/**
 * Gets the Twitch user information from the Qapla user with their TwitchId
 * @param {string} userTwitchId Twitch Id of the user
 */
export async function getTwitchDataCloudFunction(userTwitchId) {
	return await callCloudFunction({
		cfName: 'getTwitchUserData',
		params: {
			userTwitchId
		}
	});
}

/**
 * Generate an auth token for the user to signIn with Twitch (custom auth)
 * @param {string} userTwitchId Twitch Id of the user
 * @param {string} displayName Twitch username of the user
 */
export async function generateAuthTokenForTwitchSignIn(userTwitchId, displayName) {
	return await callCloudFunction({
		cfName: 'appTwitchSignin',
		params: {
			uid: userTwitchId,
			displayName
		}
	});
}

/**
 * Description:
 * Performs the call to the callable cloud function
 *
 * @param {object} ctx Context object that has cloud function name and parameter object.
 */
async function callCloudFunction(ctx) {
	let res = null;
	let cloudFunc = functions.httpsCallable(ctx.cfName);

	res = await cloudFunc(ctx.params);

	return res;
}

/**
 * Delete an account from the auth and any reference from the uid on the database
 * @param {string} uid User identifier
 */
 export async function deleteUserAccount(uid) {
	return await callCloudFunction({
		cfName: 'deleteAccount',
		params: {
			uid
		}
	});
}

/**
 * Verify buys and assigns products
 * @param {string} uid User identifier
 */
 export async function handleInAppPurchases(receipt, platform) {
	return await callCloudFunction({
		cfName: 'handleInAppPurchases',
		params: {
			receipt,
			platform
		}
	});
}

/**
 * Get the streamer emotes of the given streamer
 * @param {string} streamerUid Streamer (database) identifier
 */
export async function getStreamerEmotes(streamerUid) {
	return await callCloudFunction({
		cfName: 'getStreamerEmotes',
		params: {
			streamerUid
		}
	});
}

/**
 * Get the user relations with streamers (follow, subscription and subscription type on Twitch)
 * @param {string} userTwitchId User Twitch identifier
 * @param {string} streamerUid Streamer (database) identifier
 */
export async function getUserToStreamerRelationData(userTwitchId, streamerUid) {
	return await callCloudFunction({
		cfName: 'getUserToStreamerRelationData',
		params: {
			userTwitchId,
			streamerUid
		}
	});
}

/**
 * Evaluates the content of the image to know if it contains violent or adult content
 * @param {string} requestId Request identifier
 * @param {string} imageUrl Url of the image to evaluate
 */
 export async function imageContentModeration(requestId, imageUrl) {
	return await callCloudFunction({
		cfName: 'imageContentModeration',
		params: {
			requestId,
			imageUrl
		}
	});
}