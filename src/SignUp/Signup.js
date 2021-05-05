import React from 'react';
import { AsyncStorage, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ImageBackground, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextButton from "../common/TextButton";
import images from "../../assets/images";
import Header from "../common/Header";
import InputComponent from "../common/InputComponent";
import TickCircle from "../common/TickCircle";
import SimpleButton from "../common/SimpleButton";
import { connect } from 'react-redux'
import {
    signUpWithEmailAndPassword,
} from '../actions/auth'

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            email: '',
            password: ''
        }
    };
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    hasNumber(password) {
        return /\d/.test(password);
    }
    hasLetter(password) {
        return password.search(/[a-z]/i) < 0 ? false : true
    }
    hasSpecial(password) {
        const re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        return re.test(String(password));
    }

    accept() {
        this.setState(prevState => ({ showAlert: false }), () => {
            setTimeout(() => this.signUpWithEmailAndPassword(), 1000)
        })
    }

    cancel() {
        this.setState({ showAlert: !this.state.showAlert });
    }

    term() {
        this.setState({ showAlert: !this.state.showAlert });
        this.props.navigation.navigate('Terms')
    }

    privacy() {
        this.setState({ showAlert: !this.state.showAlert });
        this.props.navigation.navigate('Privacy')
    }

    togglePrivacyAlertModal = () => {
        this.setState({ showAlert: !this.state.showAlert });
    };

    signUpWithEmailAndPassword = () => {

        const { email,
            password,
            isValidEmail,
            isLeast6Char,
            isContainLetter,
            isContainNum,
            isContainSpecial } = this.state
        if (isValidEmail && isLeast6Char && isContainLetter && isContainNum && isContainSpecial) {
            this.props.signUpWithEmailAndPassword(email, password)
                .then(() => {
                    this.props.navigation.navigate('Introduction');
                    //this.props.navigation.navigate('UserProfile')
                })
                .catch((err) => {
                    console.log('signup error: ', err);
                })
        }
        else {
            alert('The email and password is invalid!')
            console.log('The email and password is invalid!')
        }

    }

    renderPrivacyAlert() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('85%'),
                    height: hp('25%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: wp(2),
                    paddingRight: wp(2)
                }}>


                    <Text style={{ fontSize: wp('4%'), fontWeight: 'bold', textAlign: 'left', marginTop: hp(3), }}>Sign Up</Text>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginTop: hp(3) }}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', width: wp('80%'), justifyContent: 'center' }}>
                            <Text style={{ fontSize: wp('4%'), color: '#000000', }}>By signing up, you agree with the </Text>
                            <TouchableOpacity onPress={() => this.term()}>
                                <Text style={{ color: '#C42D3E', fontSize: wp('4%'), textDecorationLine: 'underline', }}>Terms and</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', width: wp('80%') }}>
                            <TouchableOpacity onPress={() => this.term()}>
                                <Text style={{ color: '#C42D3E', fontSize: wp('4%'), textDecorationLine: 'underline', }}>Conditions</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: wp('4%'), color: '#000000', }}> and </Text>
                            <TouchableOpacity onPress={() => this.privacy()}>
                                <Text style={{ color: '#C42D3E', fontSize: wp('4%'), textDecorationLine: 'underline', }}>Privacy Policy.</Text>
                            </TouchableOpacity>
                        </View>


                    </View>

                    {/*Buttons*/}
                    <View
                        style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <View style={{ marginRight: wp('2%') }}>

                            <TouchableOpacity onPress={() => this.accept()} style={{
                                width: wp('36%'), height: hp('7%'),
                                // backgroundColor:'grey',
                                justifyContent: 'center', alignItems: 'center',
                            }}>
                                <Text style={{ color: '#E83528', fontWeight: 'bold', fontSize: wp('4%'), }}>AGREE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginRight: wp('2%') }}>
                            <TouchableOpacity onPress={() => this.cancel()} style={{
                                width: wp('36%'), height: hp('7%'),
                                backgroundColor: 'white',
                                justifyContent: 'center', alignItems: 'center',
                             }}>
                                <Text style={{ color: '#E83528', fontWeight: 'bold', fontSize: wp('4%'), }}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


            </View>


        )
    }

    render() {
        const {
            email,
            password,
            isValidEmail,
            isLeast6Char,
            isContainLetter,
            isContainNum,
            isContainSpecial } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>

                    <Header onPress={() => this.props.navigation.goBack()} bgColor={'#250901'} headerBorderWidth={2} imgLeft={images.ic_back} title={'Sign Up'} />

                    <View style={styles.mainContainerInput}>
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
                        <View style={{ marginVertical: wp(2), marginRight: wp(28) }}>
                            <TickCircle img={isValidEmail ? images.ic_checked : images.ic_unchecked} title={'Valid email.'} />
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
                            placeholder={'Password'}
                            placeholderTextColor={'#fff'}
                            value={password}
                            onChangeText={value => this.setState({
                                password: value,
                                isLeast6Char: value && value.length >= 6 ? true : false,
                                isContainLetter: this.hasLetter(value),
                                isContainNum: this.hasNumber(value),
                                isContainSpecial: this.hasSpecial(value)
                            })}
                        />
                        <View style={{ marginVertical: hp(2) }}>
                            <TickCircle img={isLeast6Char ? images.ic_checked : images.ic_unchecked} title={'At least 6 characters long'} />
                            <TickCircle img={isContainLetter ? images.ic_checked : images.ic_unchecked} title={'Contains a letter.'} />
                            <TickCircle img={isContainNum ? images.ic_checked : images.ic_unchecked} title={'Contains a number.'} />
                            <TickCircle img={isContainSpecial ? images.ic_checked : images.ic_unchecked} title={'Contains a special character.'} />
                        </View>
                        <Modal
                            visible={this.state.showAlert}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.togglePrivacyAlertModal}
                        >
                            {this.renderPrivacyAlert()}
                        </Modal>
                        <View style={styles.btnView}>
                            <SimpleButton
                                btnHeight={hp(6)}
                                onPress={this.togglePrivacyAlertModal} textColor={'#000000'} title={'Sign Up'} />
                            <TextButton onPress={() => this.props.navigation.navigate('Login')} title={'Already have an account?'} />
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
    headerContainer: {
        // height:hp(12),
        backgroundColor: 'orange'
    },
    logo: {
        resizeMode: 'contain',
        // height: hp(20),
        width: wp(25),
    },
    mainContainerImg: {
        // height:hp(18),
        alignItems: 'center',
        paddingTop: hp(1),
        paddingBottom: hp(20),
    },
    mainContainerInput: {
        // height:hp(72),
        marginTop: wp(12),
        alignItems: 'center'
    },
    btnView: {
        marginTop: hp(26),

    }

});

const mapDispatchToProps = (dispatch) => ({
    signUpWithEmailAndPassword: (email, password) => dispatch(signUpWithEmailAndPassword(email, password)),
    logout: () => dispatch(logout()),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
