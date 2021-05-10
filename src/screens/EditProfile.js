import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { connect } from 'react-redux';
import { setUser as setUserAction } from "../actions/login";
import InputComponent from "../common/InputComponent";
import SimpleButton from "../common/SimpleButton";
import {showToast} from "../common/info";
import {GENDER_MALE} from "../constants/constants";

const genders = [
    {
        id: 'male',
        label: 'MALE',
        image: images.gender_male
    },
    {
        id: 'female',
        label: 'FEMALE',
        image: images.gender_female
    }
];

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            location: '',
            gender: GENDER_MALE
        }
    }

    componentDidMount() {
    }

    onContinue = () => {
        const { firstName, lastName, location, gender } = this.state;
        if(firstName.length === 0){
            showToast('Please Input First Name!');
            return;
        }
        if(lastName.length === 0){
            showToast('Please Input Last Name!');
            return;
        }
        if(location.length === 0){
            showToast('Please Input Position!');
            return;
        }

        let profile = {
            firstName,
            lastName,
            location,
            gender
        }
        this.props.navigation.navigate('EditAvatar', { profile });
    }

    onSelectGender = (gender) => {
        this.setState({ gender });
    }

    render() {
        const { firstName, lastName, location, gender } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header bgColor={'#250901'} headerBorderWidth={2} title={'EDIT PROFILE'} />
                    <View style={styles.contentContainer}>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent
                                value={firstName}
                                inputPaddingLeft={wp(2)}
                                inputHeight={hp(6)}
                                inputWidth={wp(80)}
                                inputRadius={wp(10)}
                                bgColor={'#5c0801'}
                                placeholder={'First Name'}
                                onChangeText={(value) => this.setState({ firstName: value })}
                            />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent
                                value={lastName}
                                inputPaddingLeft={wp(2)}
                                inputHeight={hp(6)}
                                inputWidth={wp(80)}
                                inputRadius={wp(10)}
                                bgColor={'#5c0801'}
                                placeholder={'Last Name'}
                                onChangeText={(value) => this.setState({ lastName: value })}
                            />
                        </View>
                        <View style={{ marginBottom: wp(3) }}>
                            <InputComponent
                                value={location}
                                inputPaddingLeft={wp(2)}
                                inputHeight={hp(6)}
                                inputWidth={wp(80)}
                                inputRadius={wp(10)}
                                bgColor={'#5c0801'}
                                placeholder={'Location'}
                                imgRight={images.ic_location}
                                onChangeText={(value) => this.setState({ location: value })}
                            />
                        </View>
                        <View style={{
                            alignItems: 'center',
                            marginTop: '4%',
                        }}>
                            <View style={styles.preview}>
                                <Text style={{ color: '#ffffff', fontFamily: 'Montserrat-Regular' }}>SELECT GENDER</Text>
                            </View>
                            <View style={{
                                marginTop: hp(1),
                                backgroundColor: '#250901',
                                height: 220,
                                width: wp(90),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: '#E83528',
                                borderRadius: 7,
                            }}>
                                <View style={styles.genders}>
                                    {genders.map((item, i) => {
                                        const borderColor = gender === item.id ? '#f6ed5c' : '#54140a'
                                        const textColor = gender === item.id? '#f6ed5c' : '#860c03';
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.onSelectGender(item.id)}
                                                style={{ width: '40%', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 20, borderRadius: 8, backgroundColor: '#400a02', borderWidth: 2, borderColor: borderColor }}
                                            >
                                                <>
                                                    <Image style={{ height: '80%', width: '100%', resizeMode: 'contain' }} source={item.image} />
                                                    <Text style={{ color: textColor, marginTop: 8 }}>{item.label}</Text>
                                                    { gender === item.id ? <Image style={[styles.genderCheck,{height:hp(6)},{width: wp(6), resizeMode: 'contain'}]} source={images.ic_player_check} /> : null}
                                                </>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewBottom}>
                            <SimpleButton
                                onPress={() => this.onContinue()}
                                btnHeight={hp(6)}
                                btnWidth={wp(80)}
                                textColor={'#000000'} title={'CONTINUE'}
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
        backgroundColor: '#881000',
    },
    contentContainer: {
        height: hp(100),
        width: wp(100),
        padding: wp(5),
        alignItems: 'center'
        // backgroundColor:'#881000',
    },
    preview: {
        height: '10%',
        width: '40%',
        backgroundColor: '#881000',
        borderWidth: 2,
        borderColor: '#E83528',
        borderRadius: wp(7),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: hp(-0.7),
        bottom: hp(0),
        left: wp(30),
        right: 0,
        zIndex: 1,
    },
    genders: {
        width: '100%',
        height: 140,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    viewBottom: {
        height: hp(15),
        // backgroundColor:'gold',
        justifyContent: 'flex-start',
        marginTop: hp(6),
    },
    genderCheck: {
        position: 'absolute',
        right: -8,
        bottom: -16
    }
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (params) => dispatch(setUserAction(params)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.login.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
