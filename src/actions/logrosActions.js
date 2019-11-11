// diego           - 26-09-2019 - us130 - File creation

import { logrosActRef, logrosRef, cuentasVerificadasRef, activeEventsRef, eventParticipantsRef, activeTournamentsRef, pointsTournamentsRef } from '../services/database';
import { LOAD_USER_VERIFICATION_STATUS, LOAD_LOGROS_ACTIVOS, REMOVE_LOGRO_ACTIVO, LOAD_LOGROS_COMPLETOS } from '../utilities/Constants';

export const loadQaplaLogros = (uid) => async (dispatch) => {
    cuentasVerificadasRef.child(uid).on('value', (verifiedAccount) => {
        /**
         * That node doesn't exist unless the user requests for verification to Qapla
         * The status is 2 when the user is already verified
         * The status is 1 when the user request for verification to Qapla
         */
        if (verifiedAccount.exists() && verifiedAccount.val().status === 2) {
            dispatch(checkIfIsUserVerifiedSuccess(true));
            dispatch(removeLogroFromActivos('Verification-Logro'));
        } else {
            dispatch(loadLogrosActivosSuccess({ tipoLogro: 'verificado', id: 'Verification-Logro' }));
            dispatch(checkIfIsUserVerifiedSuccess(false));
        }
    });

    logrosActRef.once('value', (logrosActivos) => {
        logrosActivos.forEach((typeOfLogro) => {
            if (typeOfLogro.key !== 'verifica') {
                typeOfLogro.forEach((logroActivo) => {
                    const logroActivoObject = {
                        id: logroActivo.key,
                        ...logroActivo.val()
                    }
                    dispatch(loadLogrosActivosSuccess(logroActivoObject));
                });
            }
        });
    });

    logrosRef.child(uid).child('logroIncompleto').on('value', (logrosIncompletos) => {
        if (logrosIncompletos.exists()) {
            logrosIncompletos.forEach((logroIncompleto) => {
                const logroIncompletoObject = {
                    id: logroIncompleto.key,
                    ...logroIncompleto.val()
                };
                dispatch(loadLogrosActivosSuccess(logroIncompletoObject));
            });
        }
    });

    logrosRef.child(uid).child('logroCompleto').on('child_added', (logroCompleto) => {
        const logroCompletoObject = {
            id: logroCompleto.key,
            tipoLogro: 'completado',
            ...logroCompleto.val()
        };
        dispatch(loadLogrosCompletosSuccess(logroCompletoObject));
        dispatch(removeLogroFromActivos(logroCompleto.key));
    });

    logrosActRef.on('child_removed', (removedLogro) => {
        dispatch(removeLogroFromActivos(removedLogro.key));
    });

    activeTournamentsRef.on('child_added', (activeTournament) => {
        const activeTournamentObject = {
            id: activeTournament.key,
            ...activeTournament.val()
        };
        activeTournamentObject.tipoLogro = 'tournament';
        dispatch(loadLogrosActivosSuccess(activeTournamentObject));
    });

    pointsTournamentsRef.child(uid).on('value', (tournamentsProgress) => {
        if (tournamentsProgress.exists()) {
            tournamentsProgress.forEach((tournamentProgress) => {
                const tournamentProgressObject = {
                    id: tournamentProgress.key,
                    ...tournamentProgress.val()
                };
                dispatch(loadLogrosActivosSuccess(tournamentProgressObject));
            });
        }
    });

    activeTournamentsRef.on('child_removed', (removedTournament) => {
        dispatch(removeLogroFromActivos(removedTournament.key));
    });

    activeEventsRef.on('child_added', (activeEvent) => {
        const activeEventObject = {
            id: activeEvent.key,
            ...activeEvent.val()
        };
        activeEventObject.tipoLogro = 'event';
        dispatch(loadLogrosActivosSuccess(activeEventObject));
        eventParticipantsRef.child(activeEvent.key).child(uid).on('value', (eventProgress) => {
            if (eventProgress.exists()) {
                const eventProgressObject = {
                    id: activeEvent.key,
                    ...eventProgress.val()
                };
                dispatch(loadLogrosActivosSuccess(eventProgressObject));
            }
        });
    });

    activeEventsRef.on('child_removed', (removedEvent) => {
        dispatch(removeLogroFromActivos(removedEvent.key));
    });
}

const checkIfIsUserVerifiedSuccess = (payload) => {
    return {
        type: LOAD_USER_VERIFICATION_STATUS,
        payload
    }
}

const loadLogrosActivosSuccess = (payload) => {
    return {
        type: LOAD_LOGROS_ACTIVOS,
        payload
    }
}

const removeLogroFromActivos = (payload) => {
    return {
        type: REMOVE_LOGRO_ACTIVO,
        payload
    }
}

const loadLogrosCompletosSuccess = (payload) => {
    return {
        type: LOAD_LOGROS_COMPLETOS,
        payload
    }
}