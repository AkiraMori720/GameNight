import {put, takeLatest} from 'redux-saga/effects';

import {PREFERENCE} from '../actions/types';
import apiService from "../firebase/FirebaseHelper";
import {setPreferences, updatePreferenceStore} from "../actions/preference";

const updatePreference = function* updatePreference({data}) {
	const { userId, preferences } = data;

	yield put(updatePreferenceStore(preferences));
	apiService.setPreferencesForUser(userId, preferences,  (res) => {
		if (res.message !== null) {
			console.log(res.message)
		}
	});
};

const root = function* root() {
	yield takeLatest(PREFERENCE.UPDATE, updatePreference);
};
export default root;
