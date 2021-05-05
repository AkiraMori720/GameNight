import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IconButton from "../common/IconButton";
import TextButton from "../common/TextButton";
import images from "../../assets/images";
import Header from "../common/Header";
import { connect } from 'react-redux'
import {
    loginWithFacebook,
    loginWithGoogle
} from '../actions/auth'

class SignUpWith extends React.Component {

    signInWithFacebook = () => {
        this.props.loginWithFacebook()
            .then(() => {
                this.props.navigation.navigate('Introduction');
                //this.props.navigation.navigate('UserProfile');
            }).catch((err) => {
                console.log('error: ', err)
            })
    }

    signInwithGoogle = () => {
        this.props.loginWithGoogle()
            .then(() => {
                this.props.navigation.navigate('Introduction');
                //this.props.navigation.navigate('UserProfile');
            }).catch((err) => {
                console.log('error: ', err)
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
    loginWithFacebook: () => dispatch(loginWithFacebook()),
    loginWithGoogle: () => dispatch(loginWithGoogle()),
    logout: () => dispatch(logout()),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWith)
