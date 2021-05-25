import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import Introduction from './Introduction';
import GameType from './GameType';
import GameStyle from './GameStyle';
import GameLobby from './GameLobby';
import SpadezCrew from './SpadezCrew';
import GameOver from './GameOver';
import Setting from '../Setting/Setting';
import GamePreferences from './GamePreferences';
import Terms from "../SignUp/Terms";
import EditPlayer from "./EditPlayer";
import EditAvatar from "./EditAvatar";
import Original from "./Original";
import LeaderBoard from "./LeaderBoard";
import SelectPartner from "./SelectPartner";

const InsideStackNav = createStackNavigator();

const InsideStack = () => {
    return (
        <InsideStackNav.Navigator screenOptions={{headerMode: 'none', headerShown: false}}>
            <InsideStackNav.Screen
                name='Introduction'
                component={Introduction}
            />
            <InsideStackNav.Screen
                name='EditProfile'
                component={EditProfile}
            />
            <InsideStackNav.Screen
                name='EditAvatar'
                component={EditAvatar}
            />
            <InsideStackNav.Screen
                name='EditPlayer'
                component={EditPlayer}
            />
            <InsideStackNav.Screen
                name='UserProfile'
                component={UserProfile}
            />
            <InsideStackNav.Screen
                name='GameType'
                component={GameType}
            />
            <InsideStackNav.Screen
                name='GameStyle'
                component={GameStyle}
            />
            <InsideStackNav.Screen
                name='GameLobby'
                component={GameLobby}
            />
            <InsideStackNav.Screen
                name='SpadezCrew'
                component={SpadezCrew}
            />
            <InsideStackNav.Screen
                name='SelectPartner'
                component={SelectPartner}
            />
            <InsideStackNav.Screen
                name='Original'
                component={Original}
            />
            <InsideStackNav.Screen
                name='GameOver'
                component={GameOver}
            />
            <InsideStackNav.Screen
                name='Setting'
                component={Setting}
            />
            <InsideStackNav.Screen
                name='GamePreferences'
                component={GamePreferences}
            />
            <InsideStackNav.Screen
                name='Terms'
                component={Terms}
            />
            <InsideStackNav.Screen
                name='LeaderBoard'
                component={LeaderBoard}/>
        </InsideStackNav.Navigator>
    );
}


export default InsideStack;



