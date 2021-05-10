import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/createStore';
import AppContainer from "./src/AppContainer";
import {appInit} from "./src/actions/app";
import Toast from './src/Component/Toast';

export default class App extends Component {
    constructor() {
        super();
        this.init();
    }

    init = async() => {
        store.dispatch(appInit());
    }

    render() {
        return (
            <Provider store={store}>
                <AppContainer />
                <Toast/>
            </Provider>
        );
    }
}
