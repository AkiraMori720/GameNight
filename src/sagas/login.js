import {
	put, takeLatest,
} from 'redux-saga/effects';

import 'moment/min/locales';

import {
	appStart, ROOT_INSIDE, ROOT_OUTSIDE
} from '../actions/app';
import {LOGIN, LOGOUT} from "../actions/types";
import AsyncStorage from "@react-native-community/async-storage";
import Navigation from "../common/Navigation";

const handleLoginSuccess = function* handleLoginSuccess({ data }) {
	// const { uid, profile } = data;
	//
	// if(!profile.firstName || !profile.lastName){
	// 	yield put(appStart({root: ROOT_SET_NAME}));
	// 	return;
	// }
	//
	// // Categories
	// let categories = yield FirebaseStore.getCategories();
	// let updateForumCount = 0;
	// categories.forEach(category => {
	// 	let updateForums = category.forums.filter(forum => forum.updatedAt && forum.updatedAt > profile.lastVisit);
	// 	updateForumCount += updateForums.length;
	// })
	// yield put(setUpdateForums(updateForumCount));
	// yield put(setCategories(categories));
	//
	// // RelationShips
	// let relationship = yield FirebaseStore.getRelationshipCategory();
	// let updateForums = relationship.forums.filter(forum => forum.updatedAt && forum.updatedAt > (profile.lastVisitRelationShip??profile.lastVisit));
	// let updateRelationShipForumCount = updateForums.length;
	// yield put(setRelationShipUpdateForums(updateRelationShipForumCount));
	// yield put(setCategory(relationship));
	//
	// // Chat Rooms
	// let rooms =  yield FirebaseStore.getUserRooms(uid);
	// let unread = 0;
	// rooms.forEach(room => unread += room.unread);
	// yield put(setUnreadMessages(unread));
	// yield put(setRooms(rooms));
	//
	console.log('loginSuccess', data);
	yield AsyncStorage.setItem('USER', JSON.stringify(data));
	yield put(appStart({root : ROOT_INSIDE}));
};

const handleLogout = function* handleLogout({}) {
	yield AsyncStorage.removeItem('authProvider');
	yield AsyncStorage.removeItem('credential');
	yield AsyncStorage.removeItem('USER');
	yield put(appStart({root : ROOT_OUTSIDE}));
	//setTimeout(() => Navigation.navigate('Login'), 100);
};

const root = function* root() {
	yield takeLatest(LOGIN.SUCCESS, handleLoginSuccess);
	yield takeLatest(LOGOUT, handleLogout);
};
export default root;
