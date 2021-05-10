import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import images from "../../assets/images";
import SimpleButton from "../common/SimpleButton";
import {appStart as appStartAction, ROOT_ONBOARD, ROOT_OUTSIDE} from "../actions/app";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-community/async-storage";
import apiService from "../firebase/FirebaseHelper";
import {loginSuccess as loginSuccessAction, logout as logoutAction} from "../actions/login";

class OnBoarding extends Component {
    static propTypes = {
        appStart: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


    continue = async () => {
        const { appStart, loginSuccess, logout } = this.props;
        const provider =  await AsyncStorage.getItem('authProvider');
        const credential = await AsyncStorage.getItem('credential');
        this.setState({loading: true});
        if(provider && credential){
            let authCredential = JSON.parse(credential);
            if(provider === 'email'){
                if(authCredential.email && authCredential.password){
                    apiService.loginWithEmailPass(authCredential.email, authCredential.password, async (res) => {
                        if (res.isSuccess) {
                            if (res.response && !res.response.disabled) {
                                console.log('email auth', res.response);
                                loginSuccess(res.response);
                                this.setState({loading: false});
                                return;
                            }
                        }
                        logout();
                        this.setState({loading: false});
                    });
                    return;
                }
            } else {
                if(authCredential.token){
                    apiService.loginWithCredential(provider, authCredential.token, async (res) => {
                        if (res.isSuccess) {
                            if (res.response && !res.response.disabled) {
                                console.log('oauth', res);
                                await AsyncStorage.setItem('authProvider', provider);
                                await AsyncStorage.setItem('credential', JSON.stringify({ token: res.token }));

                                loginSuccess(res.response);
                                this.setState({loading: false});
                                return;
                            }
                        }
                        logout();
                        this.setState({loading: false});
                    });
                }
            }
        }

        appStart({root:ROOT_OUTSIDE});
        this.setState({loading: false});
    }

    render() {
        const { loading } = this.state;
        return (
            <View style={{ flex:1}}>
                <ImageBackground source={images.onboard} style={styles.backgroundImage}>
                    <View style={{flexDirection :'row',justifyContent:'center', alignItems:'flex-end', top:hp(85)}}>
                        <SimpleButton                        
                            onPress={() => this.continue()}
                            btnHeight={hp(6)}
                            btnWidth={wp(70)}                            
                            textColor={'#000000'}
                            fontSize={wp(5)}
                            title={'CONTINUE'}
                            loading={loading}
                        />
                    </View>
                </ImageBackground>    
            </View>

        );


    }
}
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', // or 'stretch'
    },
});

const mapDispatchToProps = dispatch => ({
    appStart: params => dispatch(appStartAction(params)),
    loginSuccess: params => dispatch(loginSuccessAction(params)),
    logout: () => dispatch(logoutAction({}))
});

export default connect(null, mapDispatchToProps)(OnBoarding);