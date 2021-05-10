/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

if (__DEV__) {
    require('./ReactotronConfig');
} else {
    console.log = () => {};
    console.time = () => {};
    console.timeLog = () => {};
    console.timeEnd = () => {};
    console.warn = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.error = () => {};
    console.info = () => {};
}

AppRegistry.registerComponent(appName, () => require('./App').default);
