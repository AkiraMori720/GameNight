import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IconButton from "../common/IconButton";
import TextButton from "../common/TextButton";
import images from "../../assets/images";
import Header from "../common/Header";
import { connect } from 'react-redux'
import {showToast} from "../common/info";
import apiService from "../firebase/FirebaseHelper";
import {loginSuccess as loginSuccessAction, logout as logoutAction} from "../actions/login";

class SignUpWith extends React.Component {

    signInWithFacebook = () => {
        const { loginSuccess, logout } = this.props;
        apiService.signinWithFacebook(async (res) => {
            if (res.isSuccess) {
                if (res.response && res.response.disabled) {
                    logout()
                }
                else {
                    loginSuccess(res.response);
                }
            } else {
                console.log("facebook signin error: ", res.message);
                showToast('Login Failed!');
            }
        })
    }

    signInwithGoogle = async () => {
        const { loginSuccess, logout } = this.props;
        await apiService.signinWithGoogle((res) => {
            if (res.isSuccess) {
                console.log('google auth', res);
                if (res.response && res.response.disabled) {
                    logout()
                }
                else {
                    loginSuccess(res.response);
                }
            } else {
                console.log("google signin error: ", res.message);
                showToast('Login Failed!');
            }
        })
    }

    render() {
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer} >
                    <View>
                        <Header bgColor={'#250901'} headerBorderWidth={2} textColor={'#FFFFFF'} title={'Sign Up With'} />
                    </View>
                    <View style={styles.imgContainer}>
                        <Image style={styles.logo} source={images.logo} />
                    </View>

                    <View >
                        <View style={styles.viewLink}>
                            <View>
                                <IconButton
                                    onPress={this.signInWithFacebook}
                                    textPaddingLeft={wp(12)}
                                    iconPaddingLeft={wp(6)}
                                    btnWidth={wp(80)}
                                    btnHeight={hp(6)}
                                    btnRadius={wp(15)}
                                    iconHeight={hp(3)}
                                    iconWidth={wp(3)}
                                    imgLeftColor={'#000000'}
                                    imgLeft={images.ic_facebook}
                                    textColor={'#000000'}
                                    title={'FACEBOOK'}
                                />
                            </View>
                            <View style={{marginTop:'6%'}}>
                                <IconButton
                                    onPress={this.signInwithGoogle}
                                    textPaddingLeft={wp(13)}
                                    iconPaddingLeft={wp(6)}
                                    btnWidth={wp(80)}
                                    btnHeight={hp(6)}
                                    btnRadius={wp(15)}
                                    iconHeight={hp(4)}
                                    iconWidth={wp(5)}
                                    imgLeftColor={'#000000'}
                                    imgLeft={images.ic_google}
                                    textColor={'#000000'}
                                    title={'GOOGLE'}
                                />
                            </View>
                            <View style={{marginTop:'6%'}}>
                                <IconButton onPress={() => this.props.navigation.navigate('SignUp')} textPaddingLeft={wp(15)} btnWidth={wp(80)} iconPaddingLeft={wp(6)} btnHeight={hp(6)} btnRadius={wp(15)}   imgLeftColor={'#000000'} iconHeight={hp(5)} iconWidth={wp(5)}  imgLeft={images.ic_email} textColor={'#000000'} title={'EMAIL'} />
                            </View>
                            <TextButton onPress={() => this.props.navigation.navigate('Login')} title={'Already have an account?'}/>
                        </View>
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
        backgroundColor:'#881000',
    },
    imgContainer: {
        // height:hp(45),
        // backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom:hp(9)
    },
    logo: {
        // resizeMode:'contain',
        // height: hp(30),
        // width:wp(25),
    },
    viewLink: {
        // height:hp(47),
        // backgroundColor: 'gold',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop:hp(7)
    }
});

const mapDispatchToProps = (dispatch) => ({
    loginSuccess: (params) => dispatch(loginSuccessAction(params)),
    logout: () => dispatch(logoutAction())
})

const mapStateToProps = (state) => ({
    auth: state.login.profile,
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWith)
