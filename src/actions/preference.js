import axios from 'axios'
import {
    UPDATE_PREFERENCE_STORE,
} from './types'
import apiService from '../firebase/FirebaseHelper'


export function updatePreferenceStore(value = {}) {
    return {
        type: UPDATE_PREFERENCE_STORE,
        payload: value
    }
}

export function getPreferences(userId) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            // ***** for firebase
            apiService.getPreferencesForUser(userId, (res) => {
                console.log('res--->>', res)
                if (res.isSuccess) {
                    dispatch({
                        type: UPDATE_PREFERENCE_STORE,
                        payload: res.response
                    })
                    resolve()
                } else {
                    console.log('failed: ', res.message)
                }
            });
        })
    }
}

export function setPreferences(userId, preferences) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            dispatch({
                type    : UPDATE_PREFERENCE_STORE,
                payload : preferences
            })

            apiService.setPreferencesForUser(userId, preferences,  (res) => {
                resolve()
                if (res.message !== null) {
                    console.log(res.message)
                }
            });
        })
    }

}

export const actions = {
    updatePreferenceStore,
    getPreferences,
    setPreferences
}
