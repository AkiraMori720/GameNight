import {
	put, takeLatest,
} from 'redux-saga/effects';

import 'moment/min/locales';

import {
	appStart, ROOT_INSIDE, ROOT_OUTSIDE
} from '../actions/app';
import {LOGIN, LOGOUT} from "../actions/types";
import AsyncStorage from "@react-native-community/async-storage";
import FirebaseHelper from "../firebase/FirebaseHelper";
import gameServices from "../firebase/gameService";

const handleLoginSuccess = function* handleLoginSuccess({ data }) {
	console.log('loginSuccess', data);
	yield FirebaseHelper.setFcmToken(data.userid);
	gameServices.subscribe(data.userid);
	yield put(appStart({root : ROOT_INSIDE}));
};

const handleLogout = function* handleLogout({}) {
	yield AsyncStorage.removeItem('authProvider');
	yield AsyncStorage.removeItem('credential');
	yield AsyncStorage.removeItem('USER');
	gameServices.unSubscribe();
	yield put(appStart({root : ROOT_OUTSIDE}));
	//setTimeout(() => Navigation.navigate('Login'), 100);
};

const root = function* root() {
	yield takeLatest(LOGIN.SUCCESS, handleLoginSuccess);
	yield takeLatest(LOGOUT, handleLogout);
};
export default root;
