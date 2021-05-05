import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from "../common/Header";
import images from "../../assets/images";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import TextButton from "../common/TextButton";
import CheckBox from "../common/CheckBox";
import { connect } from 'react-redux'
import {
    loginWithEmailAndPassword,
} from '../actions/auth'

class Login extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            email : '',
            password: ''
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    signIn = () => {
        const { email, password, isValidEmail, isLeast6Char } = this.state;
        if (isValidEmail && isLeast6Char) {
            this.props.loginWithEmailAndPassword(email, password)
                .then(() => {
                    this.props.navigation.navigate('Introduction');
                    //this.props.navigation.navigate('UserProfile')
                })
                .catch((err) => {
                    console.log('signin error:', err);
                })
        }
        else {
            alert('The email and password is invalid!')
        }
    }

    render() {
        const { email, password } = this.state
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
                            placeholderTextColor={'#fff'}
                            value={email}
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
                        placeholderTextColor={'#fff'}
                        value={password}
                        onChangeText={value => this.setState({password: value, isLeast6Char: value && value.length >= 6 ? true : false,})}
                    />
                    <View style={{flexDirection:'row',alignItems: 'center',marginTop:hp(1.5)}}>
                        <CheckBox
                            checkTitle={'Remember Me'}
                        />
                    </View>
                    <View style={{marginTop:wp(6)}}>
                        <SimpleButton
                            onPress={this.signIn}
                            btnHeight={hp(6)}
                            textColor={'#000000'}
                            title={'Login'}
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
    loginWithEmailAndPassword: (email, password) => dispatch(loginWithEmailAndPassword(email, password)),
    logout: () => dispatch(logout()),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
