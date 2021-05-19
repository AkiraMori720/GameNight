import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/createStore';
import AppContainer from "./src/AppContainer";
import {appInit} from "./src/actions/app";
import Toast from './src/Component/Toast';
import messaging from "@react-native-firebase/messaging";
import {notificationOpen} from "./src/actions/notification";
import InAppNotification, {INAPP_NOTIFICATION_EMITTER} from "./src/Component/InAppNotification";
import EventEmitter from './src/common/events';

export default class App extends Component {
    constructor() {
        super();
        this.init();
    }

    init = async() => {
        messaging().onMessage(remoteMessage => {
            console.log(
                'Notification caused app to open from foreground state:',
                remoteMessage,
            );
            EventEmitter.emit(INAPP_NOTIFICATION_EMITTER, remoteMessage);
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.data,
            );
            store.dispatch(notificationOpen(remoteMessage.data));
        });

        // Check whether an initial notification is available
        const remoteMessage = await messaging().getInitialNotification();

        if (remoteMessage) {
            console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.data,
            );
            store.dispatch(notificationOpen(remoteMessage.data));
        } else {
            store.dispatch(appInit());
        }
    }

    render() {
        return (
            <Provider store={store}>
                <AppContainer />
                <InAppNotification />
                <Toast/>
            </Provider>
        );
    }
}
