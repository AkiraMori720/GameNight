import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './common/Navigation';
import {getActiveRouteName} from './common/Navigation/utiles';
import 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';

import {ROOT_INSIDE, ROOT_LOADING, ROOT_ONBOARD, ROOT_OUTSIDE} from './actions/app';

import Splash from "./screens/Splash";
import OnBoarding from "./screens/OnBoarding";
import OutSideStack from "./screens/OutsideStack";
import InsideStack from "./screens/InsideStack";

// App
const Stack = createStackNavigator();
const App = React.memo(({ root }) => {
     console.log('app root', root);

    React.useEffect(() => {
        const state = Navigation.navigationRef.current?.getRootState();
        Navigation.routeNameRef.current = getActiveRouteName(state);
    }, []);

    return (
        <NavigationContainer
            ref={Navigation.navigationRef}
            onStateChange={(state) => {
                const previousRouteName = Navigation.routeNameRef.current;
                const currentRouteName = getActiveRouteName(state);
                if (previousRouteName !== currentRouteName) {
                }
                Navigation.routeNameRef.current = currentRouteName;
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
                <>
                    {root === ROOT_LOADING ? (
                        <Stack.Screen
                            name='Splash'
                            component={Splash}
                        />
                    ) : null}
                    {root === ROOT_ONBOARD ? (
                        <Stack.Screen
                            name='OnBoarding'
                            component={OnBoarding}
                        />
                    ) : null}
                    {root === ROOT_OUTSIDE  ? (
                        <Stack.Screen
                            name='OutSideStack'
                            component={OutSideStack}
                        />
                    ) : null}
                    {root === ROOT_INSIDE ? (
                        <Stack.Screen
                            name='InsideStack'
                            component={InsideStack}
                        />
                    ) : null}
                </>
            </Stack.Navigator>
        </NavigationContainer>
    );
});

const mapStateToProps = state => ({
    root: state.app.root
});

App.propTypes = {
    root: PropTypes.string
};

const AppContainer = connect(mapStateToProps)(App);
export default AppContainer;




