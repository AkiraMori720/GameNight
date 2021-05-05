import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Splash from './Splash';
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
import SignUpWith from '../SignUp/SignUpWith';
import Signup from '../SignUp/Signup';
import Login from '../SignUp/Login';
import ResetPassword from '../SignUp/ResetPassword';
import Terms from '../SignUp/Terms';
import Original from './Original';
import OnBoarding from "./OnBoarding";
import Privacy from "../SignUp/Privacy";
import NewPassword from "../SignUp/NewPassword";
import NewBtn from "../common/NewBtn";
import { TransitionPresets } from 'react-navigation-stack';





export const StackNavigation = createStackNavigator({
    Splash: {
        screen: Splash,
    },
    OnBoarding: {
        screen: OnBoarding,
    },
    Introduction: {
        screen: Introduction,
    },
    UserProfile: {
        screen: UserProfile,
    },
    EditProfile: {
        screen: EditProfile,
    },
    GameType: {
        screen: GameType,
    },
    GameStyle: {
        screen: GameStyle,
    },
    GameLobby: {
        screen: GameLobby,
    },
    SpadezCrew: {
        screen: SpadezCrew,
    },
    GameOver: {
        screen: GameOver,
    },
    Setting: {
        screen: Setting,
    },
    GamePreferences: {
        screen: GamePreferences,
    },
    SignWith: {
        screen: SignUpWith,
    },
    SignUp: {
        screen: Signup,
    },
    Login: {
        screen: Login,
    },
    ResetPassword: {
        screen: ResetPassword,
    },
    NewPassword: {
        screen: NewPassword,
    },
    Terms: {
        screen: Terms,
    },
    Privacy: {
        screen: Privacy,
    },
    Original: {
        screen: Original,
    },
    NewBtn: {
        screen: NewBtn,
    },
},
    {
        headerMode: 'none',
        initialRouteName: 'Splash',
        defaultNavigationOptions: {
            // gestureEnabled: true,
            // cardOverlayEnabled: true,
            //...TransitionPresets.SlideFromRightIOS ,
        },
    }
);


export default createAppContainer(StackNavigation);



