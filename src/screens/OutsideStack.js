import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpWith from '../SignUp/SignUpWith';
import Signup from '../SignUp/Signup';
import Login from '../SignUp/Login';
import ResetPassword from '../SignUp/ResetPassword';
import Terms from '../SignUp/Terms';
import Original from './Original';
import Privacy from "../SignUp/Privacy";
import NewPassword from "../SignUp/NewPassword";
import NewBtn from "../common/NewBtn";

const OutSideStackNav = createStackNavigator();

const OutSideStack = () => {
    return (
        <OutSideStackNav.Navigator screenOptions={{headerMode: 'none', headerShown: false}}>
            <OutSideStackNav.Screen
                name='SignUpWith'
                component={SignUpWith}
            />
            <OutSideStackNav.Screen
                name='SignUp'
                component={Signup}
            />
            <OutSideStackNav.Screen
                name='Login'
                component={Login}
            />
            <OutSideStackNav.Screen
                name='ResetPassword'
                component={ResetPassword}
            />
            <OutSideStackNav.Screen
                name='NewPassword'
                component={NewPassword}
            />
            <OutSideStackNav.Screen
                name='Terms'
                component={Terms}
            />
            <OutSideStackNav.Screen
                name='Privacy'
                component={Privacy}
            />
            <OutSideStackNav.Screen
                name='Original'
                component={Original}
            />
            <OutSideStackNav.Screen
                name='NewBtn'
                component={NewBtn}
            />
        </OutSideStackNav.Navigator>
    );
}


export default OutSideStack;



