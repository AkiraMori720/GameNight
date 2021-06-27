import React from 'react';
import {View,StyleSheet,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from "../common/Header";
import images from "../../assets/images";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import TextButton from "../common/TextButton";
import CheckBox from "../common/CheckBox";
import { connect } from 'react-redux'
import AsyncStorage from "@react-native-community/async-storage";
import {showToast} from "../common/info";
import apiService from "../firebase/FirebaseHelper";
import {loginSuccess as loginSuccessAction, logout as logoutAction} from "../actions/login";

class Login extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            email : '',
            password: '',
            remember: false,
            loading: false
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    signIn = () => {
        const { email, password, isValidEmail, isLeast6Char } = this.state;
        const { loginSuccess } = this.props;

        if (isValidEmail && isLeast6Char) {
            this.setState({loading: true});
            apiService.loginWithEmailPass(email, password, async (res) => {
                if (res.isSuccess) {
                    if (res.response && !res.response.disabled) {
                        if(this.state.remember){
                            await AsyncStorage.setItem('authProvider', 'email');
                            await AsyncStorage.setItem('credential', JSON.stringify({ email, password }));
                        }
                        loginSuccess(res.response);
                    } else {
                        showToast('This user was disabled!');
                    }
                } else {
                    console.log("login error: ", res.message);
                    if(res.message.indexOf('user-not-found') >= 0){
                        showToast('The user is not registered!');
                    } else {
                        showToast('The email and password is invalid!');
                    }
                }
                this.setState({loading: false});
            })
        }
        else {
            if(email.length === 0){
                showToast('Please enter email');
            } else if(password.length === 0) {
                showToast('Please enter password');
            } else {
                showToast('The email and password is invalid!');
            }
            this.setState({loading: false});
        }
    }

    render() {
        const { email, password, loading, remember } = this.state
        return(
            <SafeAreaView style={{flex:1}}>
            <View style={styles.mainContainer}>
                <Header onPress={() => this.props.navigation.goBack()} bgColor={'#250901'} headerBorderWidth={2}   imgLeft={images.ic_back} title={'LOGIN'} />
                <View style={styles.mainContainerBottom}>
                    <View style={{marginBottom:wp(2)}}>
                        <InputComponent
                            secureTextEntry={false}
                            inputPaddingLeft={wp(2)}
                            inputHeight={hp(6)}
                            inputWidth={wp(80)}
                            inputRadius={wp(10)}
                            bgColor={'#5c0801'}
                            placeholder={'Email'}
                            keyboardType="email-address"
                            value={email}
                            autoCapitalize={'none'}
                            onChangeText={value => this.setState({ email: value, isValidEmail: this.validateEmail(value) })}
                        />
                    </View>
                    <InputComponent
                        secureTextEntry={true}
                        inputPaddingLeft={wp(2)}
                        inputHeight={hp(6)}
                        inputWidth={wp(80)}
                        inputRadius={wp(10)}
                        bgColor={'#5c0801'}
                        placeholder={'Password'}
                        value={password}
                        autoCapitalize={'none'}
                        onChangeText={value => this.setState({password: value, isLeast6Char: value && value.length >= 6})}
                    />
                    <View style={{flexDirection:'row',alignItems: 'center',marginTop:hp(1.5)}}>
                        <CheckBox
                            checkTitle={'Remember Me'}
                            value={remember}
                            onChange={value => {
                                this.setState({ remember: value });
                                console.log('this.remember', value);
                            }}
                        />
                    </View>
                    <View style={{marginTop:wp(6)}}>
                        <SimpleButton
                            onPress={this.signIn}
                            btnHeight={hp(6)}
                            textColor={'#000000'}
                            title={'Login'}
                            loading={loading}
                        />
                    </View>
                    <TextButton onPress={() => this.props.navigation.navigate('ResetPassword')} title={'Forgot Password?'}/>
                </View>
            </View>
            </SafeAreaView>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        height:hp(100),
        width:wp(100),
        alignItems:'center',
        backgroundColor:'#881000'
    },
    mainContainerUpper: {
        // height:hp(35),
        alignItems: 'center',
    },
    logo: {
        resizeMode:'contain',
        // height: hp(30),
        // width:wp(25),
    },
    mainContainerBottom:{
        // height:hp(55)
        marginTop:hp(7)
    }
});

const mapDispatchToProps = (dispatch) => ({
    loginSuccess: (params) => dispatch(loginSuccessAction(params)),
    logout: () => dispatch(logoutAction()),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.login.profile,
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
