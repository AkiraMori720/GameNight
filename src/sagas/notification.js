import {
    takeLatest, take, select, put
} from 'redux-saga/effects';
import * as types from '../actions/types';
import AsyncStorage from "@react-native-community/async-storage";
import apiService from "../firebase/FirebaseHelper";
import {appStart, ROOT_INSIDE} from "../actions/app";
import {loginSuccess} from "../actions/login";
import Navigation from '../common/Navigation';
import store from "../store/createStore";

const handleOpen = function* handleOpen({ params }) {
    const authorized = yield select(state => state.login.authorized);
    console.log('handleOpen', params);
    if(!authorized){
        const provider =  yield AsyncStorage.getItem('authProvider');
        const credential = yield AsyncStorage.getItem('credential');

        if(provider && credential){
            let authCredential = JSON.parse(credential);
            if(provider === 'email'){
                if(authCredential.email && authCredential.password){
                    apiService.loginWithEmailPass(authCredential.email, authCredential.password, async (res) => {
                        if (res.isSuccess) {
                            if (res.response && !res.response.disabled) {
                                store.dispatch(loginSuccess(res.response));
                                console.log('login Success With Email', params);
                                setTimeout(() => Navigation.navigate('Original', params), 1000);
                            }
                        }
                    });
                }
            } else {
                if(authCredential.token){
                    apiService.loginWithCredential(provider, authCredential.token, async (res) => {
                        if (res.isSuccess) {
                            if (res.response && !res.response.disabled) {
                                await AsyncStorage.setItem('authProvider', provider);
                                await AsyncStorage.setItem('credential', JSON.stringify({ token: res.token }));

                                store.dispatch(loginSuccess(res.response));
                                console.log('login Success With Oauth', params);
                                setTimeout(() => Navigation.navigate('Original', params), 1000);
                            }
                        }
                    });
                }
            }
        }
    } else{
        setTimeout(() => Navigation.navigate('Original', params), 1000);
    }
}

const root = function* root() {
    yield takeLatest(types.NOTIFICATION.OPEN, handleOpen);
};
export default root;