import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ImageBackground, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from "../common/Header";
import images from "../../assets/images";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import apiService from '../firebase/FirebaseHelper'
import {showToast} from "../common/info";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            email: '',
            isValidEmail: false,
            loading: false
        }
    };

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    accept() {
        this.togglePrivacyAlertModal();
        // Not Change Password Without Login
        //this.props.navigation.navigate('NewPassword')
        this.props.navigation.navigate('Login')
    }

    sendEmail = () => {
        const { email, isValidEmail } = this.state
        if (isValidEmail) {
            this.setState({ loading: true });
            apiService.sendEmailWithPassword(email, (res) => {
                if (res.isSuccess) {
                    this.togglePrivacyAlertModal();
                }
                else {
                    showToast(res.message);
                }
                this.setState({ loading: false });
            })
        }
        else {
            showToast('The email address is invalid!')
        }
    }

    togglePrivacyAlertModal = () => {
        this.setState({ showAlert: !this.state.showAlert });
    };


    renderPrivacyAlert() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('60%'),
                    height: hp('20%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                }}>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2), }}>Reset Password</Text>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', paddingLeft: wp(5), width: wp(55) }}>
                        <Text style={{ fontSize: wp(3.2), textAlign: 'center', fontWeight: 'bold', marginTop: wp('0%'), color: '#030303' }}>We have sent a reset password link to your email.</Text>
                    </View>

                    {/*Buttons*/}
                    <View
                        style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: wp('2%') }}>

                            <TouchableOpacity onPress={() => this.accept()} style={{
                                width: wp(55), height: hp('7%'),
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                justifyContent: 'center', alignItems: 'center',
                                borderColor: '#d0d0d0',
                            }}>
                                <Text style={{ color: '#871E2C', fontSize: wp(3.5), fontWeight: 'bold', }}>OKAY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    render() {
        const { email, loading } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>

                    <Header onPress={() => this.props.navigation.goBack()} bgColor={'#250901'} headerBorderWidth={2} imgLeft={images.ic_back} title={'LOGIN'} />


                    <View style={styles.viewMiddle}>
                        <View style={styles.viewInput}>
                            <InputComponent inputPaddingLeft={wp(2)}
                                inputHeight={hp(6)}
                                inputWidth={wp(80)}
                                inputRadius={wp(10)}
                                bgColor={'#5c0801'}
                                placeholder={'Email'}
                                value={email}
                                onChangeText={value => this.setState({ email: value, isValidEmail: this.validateEmail(value) })}
                            />
                        </View>
                        <Text style={styles.text}>Input the email used to create your account.</Text>
                        <Text style={styles.text}>We will send you a link to reset your password.</Text>
                    </View>
                    <Modal
                        visible={this.state.showAlert}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={this.togglePrivacyAlertModal}
                    >
                        {this.renderPrivacyAlert()}
                    </Modal>
                    <View style={styles.viewBottom}>
                        <SimpleButton
                            onPress={this.sendEmail}
                            btnHeight={hp(6)}
                            textColor={'#000000'} title={'Reset Password'}
                            loading={loading}
                        />
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
    logo: {
        resizeMode: 'contain',
        height: hp(30),
        width: wp(25),
    },
    text: {
        fontSize: wp(3.6),
        color: '#ffffff',
        textAlign: 'center',
        width: wp(79),
        fontFamily: 'Montserrat-Light'
    },
    viewInput: {
        marginVertical: hp(2.5)
    },
    viewUpper: {
        height: hp(37),
        // backgroundColor:'green',
        justifyContent: 'center',
    },
    viewMiddle: {
        height: hp(18),
        marginTop: hp(4)
        // backgroundColor:'orange',
    },
    viewBottom: {
        height: hp(37),
        // backgroundColor:'gold',
        justifyContent: 'flex-start',
        marginTop: hp(2),
    }




});


