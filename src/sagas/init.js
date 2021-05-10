import { put, takeLatest } from 'redux-saga/effects';

import { APP } from '../actions/types';
import {appReady, appStart, ROOT_LOADING} from '../actions/app';
const restore = function* restore() {
	yield put(appStart({root : ROOT_LOADING}));
	yield put(appReady({}));
};

const start = function* start() {
	//RNBootSplash.hide();
};

const root = function* root() {
	yield takeLatest(APP.INIT, restore);
	yield takeLatest(APP.START, start);
};
export default root;
