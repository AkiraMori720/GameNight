// import axios from 'axios'
// const jwt_decode = require('jwt-decode')
import { AsyncStorage } from 'react-native'
import apiService from '../firebase/FirebaseHelper'
import {
    UPDATE_AUTH_INFO
} from './types'
// import AsyncStorage from "@react-native-community/async-storage";


export function updateAuthInfo(value = {}) {
    return {
        type: UPDATE_AUTH_INFO,
        payload: value
    }
}

export function signUpWithEmailAndPassword(email, password) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            //  ***** for firebase
            apiService.signUpWithEmailAndPassword(email, password, (res) => {
                if (res.isSuccess) {
                    AsyncStorage.setItem('USER', JSON.stringify(res.response));
                    dispatch({
                        type: UPDATE_AUTH_INFO,
                        payload: res.response
                    })

                    resolve()
                } else {
                    console.log("signup error: ", res.message);
                }
            })
        })
    }
}

export function loginWithEmailAndPassword(email, password) {

    return (dispatch, getState) => {
        return new Promise((resolve) => {
            //  ***** for firebase
            apiService.loginWithEmailPass(email, password, (res) => {
                if (res.isSuccess) {
                    if (res.response && res.response.disabled) {
                        this.logout()
                    }
                    else {
                        AsyncStorage.setItem('USER', JSON.stringify(res.response));
                        dispatch({
                            type: UPDATE_AUTH_INFO,
                            payload: res.response
                        })

                        resolve();
                    }
                } else {
                    console.log("login error: ", res.message);
                }
            })
        })
    }
}

export function loginWithFacebook() {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            //  ***** for firebase
            apiService.signinWithFacebook((res) => {
                if (res.isSuccess) {
                    if (res.response && res.response.disabled) {
                        this.logout()
                    }
                    else {
                        AsyncStorage.setItem('USER', JSON.stringify(res.response));
                        dispatch({
                            type: UPDATE_AUTH_INFO,
                            payload: res.response
                        })
                        resolve()
                    }
                } else {
                    console.log("facebook signin error: ", res.message);
                }
            })
            // ***** 
        })
    }
}

export function loginWithGoogle() {

    return (dispatch, getState) => {
        return new Promise((resolve) => {
            // for test
            //         dispatch({
            //             type    : UPDATE_AUTH_INFO,
            //             payload : {
            //               user: res.user,
            //               google_token: 'google_token'
            //             }
            //         })

            //         resolve();

            //  ***** for firebase
            apiService.signinWithGoogle((res) => {
                if (res.isSuccess) {
                    if (res.response && res.response.disabled) {
                        this.logout()
                    }
                    else {
                        AsyncStorage.setItem('USER', JSON.stringify(res.response));
                        dispatch({
                            type: UPDATE_AUTH_INFO,
                            payload: res.response
                        })

                        resolve()
                    }
                } else {
                    console.log("google signin error: ", res.message);
                }
            })
            // ***** 
        })
    }
}

export function updatePassword(newpassword) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            // for test
            //         dispatch({
            //             type    : UPDATE_AUTH_INFO,
            //             payload : {
            //               user: null,
            //               google_token: null,
            //               facebook_token: null,
            //             }
            //         })

            //         resolve();

            //  ***** for firebase
            apiService.updatePassword(newpassword, (res) => {
                if (res.isSuccess) {
                    this.logout()
                    resolve()
                } else {
                    console.log("password update error: ", res.message);
                }
            })
            // ***** 
        })
    }
}

export function logout() {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            // for test
            //         dispatch({
            //             type    : UPDATE_AUTH_INFO,
            //             payload : {
            //               user: null,
            //               google_token: null,
            //               facebook_token: null,
            //             }
            //         })

            //         resolve();

            //  ***** for firebase
            apiService.signout((res) => {
                if (res.isSuccess) {
                    AsyncStorage.setItem('USER', null);
                    dispatch({
                        type: UPDATE_AUTH_INFO,
                        payload: {
                            user: null,
                        }
                    })
                    resolve();
                } else {
                    console.log("signout failed");
                }
            })
            // ***** 
        })
    }
}

export function updateProfileForUser(profileData) {
    return (dispatch, getState) => {
        return new Promise((resolve) => { 
           //  ***** for firebase
            const user = getState().auth.user
            apiService.updateProfileForUser(user, profileData, (res) => {
                if (res.isSuccess) {
                    AsyncStorage.setItem('USER', JSON.stringify(res.response));
                    dispatch({
                        type: UPDATE_AUTH_INFO,
                        payload: res.response
                    })

                    resolve()
                } else {
                    console.log("profile updating error: ", res.message);
                }
            })            
            // ***** 
        })
    }
}

export const actions = {
    updateAuthInfo,
    signUpWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithFacebook,
    loginWithGoogle,
    updatePassword,
    logout,
    updateProfileForUser,
}
