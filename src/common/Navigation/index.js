import React from 'react';
import { CommonActions, StackActions } from '@react-navigation/native';

const navigationRef = React.createRef();
const routeNameRef = React.createRef();

function back() {
    navigationRef.current?.dispatch(CommonActions.goBack());
}

function replace(name, params) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
}

function navigate(routeName, params) {
    navigationRef.current?.navigate(routeName, params);
}

function getCurrentRoute() {
    return navigationRef.current;
}

export default {
    navigationRef,
    routeNameRef,
    back,
    navigate,
    replace,
    getCurrentRoute
};

