import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from "../common/Header";
import images from "../../assets/images";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import TickCircle from "../common/TickCircle";
import { connect } from 'react-redux';
import apiService from "../firebase/FirebaseHelper";
import {showToast} from "../common/info";
import { logout as logoutAction} from "../actions/login";


class NewPassword extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            newPassword: '',
            confirmNewPassword: '',
            loading: false
        }
    }

    updatePassword = () => {
        const { newPassword, confirmNewPassword } = this.state;
        const { logout } = this.props;

        if (newPassword.length > 0 && newPassword === confirmNewPassword) {
            this.setState({loading: true});
            apiService.updatePassword(newPassword, (res) => {
                if (res.isSuccess) {
                    logout();
                    this.props.navigation.navigate('Login');
                } else {
                    console.log("password update error: ", res.message);
                    showToast('Update Failed');
                }
                this.setState({loading: false});
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
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'John'} />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'Smith'} />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent inputPaddingLeft={wp(2)} inputHeight={hp(6)} inputWidth={wp(80)} inputRadius={wp(10)} bgColor={'#5c0801'} placeholder={'sample@email.com'} />
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
                            <SimpleButton
                                onPress={this.updatePassword}
                                btnHeight={hp(6)}
                                textColor={'#000000'}
                                title={'SAVE CHANGES'}
                                loading={this.state.loading}
                            />
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
    logout: () => dispatch(logoutAction()),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.login.profile,
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword)
