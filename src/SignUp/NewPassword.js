import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from "../common/Header";
import images from "../../assets/images";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import TextButton from "../common/TextButton";
import CheckBox from "../common/CheckBox";
import TickCircle from "../common/TickCircle";
import { connect } from 'react-redux';
import {
    updatePassword,
} from '../actions/auth'


class NewPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            newPassword: '',
            confirmNewPassword: ''
        }
    }

    updatePassword = () => {
        const { newPassword, confirmNewPassword } = this.state
        if (newPassword === confirmNewPassword) {
            this.props.updatePassword(newPassword)
                .then(() => {
                    this.props.navigation.navigate('Login')
                }).catch((err) => {
                    console.log('error: ', err)
                })
        }
        else {
            alert('Please make sure your password match')
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header onPress={() => this.props.navigation.goBack()} bgColor={'#250901'} headerBorderWidth={2} imgLeft={images.ic_back} title={'ENTER NEW PASSWORD'} />
                    <View style={styles.mainContainerBottom}>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'John'} placeholderTextColor={'#fff'} />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'Smith'} placeholderTextColor={'#fff'} />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'sample@email.com'} placeholderTextColor={'#fff'} />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent
                                secureTextEntry={true}
                                inputPaddingLeft={wp(3)}
                                inputHeight={hp(6)}
                                inputWidth={wp(80)}
                                inputRadius={wp(10)}
                                bgColor={'#5c0801'}
                                iconHeight={hp(2)}
                                iconWidth={wp(3.5)}
                                imgRight={images.ic_view_pass}
                                placeholder={'New Password'}
                                placeholderTextColor={'#fff'}
                                value={this.state.newPassword}
                                onChangeText={(newPassword) => this.setState({ newPassword })}
                            />
                        </View>
                        <InputComponent
                            secureTextEntry={true}
                            inputPaddingLeft={wp(3)}
                            inputHeight={hp(6)}
                            inputWidth={wp(80)}
                            inputRadius={wp(10)}
                            bgColor={'#5c0801'}
                            iconHeight={hp(2)}
                            iconWidth={wp(3.5)}
                            imgRight={images.ic_view_pass}
                            placeholder={'Confirm New Password'}
                            placeholderTextColor={'#fff'}
                            value={this.state.confirmNewPassword}
                            onChangeText={(confirmNewPassword) => this.setState({ confirmNewPassword })}
                        />
                        {
                            (this.state.newPassword === this.state.confirmNewPassword) &&
                            <View style={{ marginVertical: wp(1.5), marginLeft: wp(7) }}>
                                <TickCircle img={images.ic_unchecked} title={'Password Matched'} />
                            </View>
                        }

                        <View style={{ marginTop: hp(28) }}>
                            <SimpleButton onPress={this.updatePassword} btnHeight={hp(6)} textColor={'#000000'} title={'SAVE CHANGES'} />
                        </View>


                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: hp(100),
        width: wp(100),
        alignItems: 'center',
        backgroundColor: '#881000'
    },
    mainContainerUpper: {
        // height:hp(35),
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        // height: hp(30),
        // width:wp(25),
    },
    mainContainerBottom: {
        // height:hp(55)
        marginTop: hp(7)
    }

});

const mapDispatchToProps = (dispatch) => ({
    updatePassword: (newpassword) => dispatch(updatePassword(newpassword)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword)
