import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/createStore';
import RootStack from "./src/screens/RootStack";

export default class App extends Component {
    constructor() {
        super();
        console.disableYellowBox = true;
    }

    render() {
        return (
            <Provider store={store}>
                <RootStack />
            </Provider>
        );
    }
}
