import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { connect } from 'react-redux';
import apiService from "../firebase/FirebaseHelper";
import AsyncStorage from "@react-native-community/async-storage";
import {USER} from "../actions/types";
import { setUser as setUserAction } from "../actions/login";
import normalize from "react-native-normalize/src/index";
import SimpleButton from "../common/SimpleButton";
import {PLAYER_PROPS} from "../constants/constants";
import {showToast} from "../common/info";


class EditPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            skinColor: 1,
            nailColor: 1,
            accessory: 'bracelet',
            spadezDeck: 'red',
            spadezTable: 1,
            playerProps: PLAYER_PROPS,
            loading: false
        }
    }

    componentDidMount() {
        console.log('componentdidmount')
        const { skinColor, accessory, nailColor, spadezDeck, spadezTable } = this.props.auth
        this.setState({
            skinColor, accessory, nailColor, spadezDeck, spadezTable
        });
    }

    updateProfileForUser = (profile, callback = () => {}) => {
        const { auth, setUser } = this.props;
        apiService.updateProfileForUser(auth.user, profile, (res) => {
            if (res.isSuccess) {
                AsyncStorage.setItem('USER', JSON.stringify(res.response));
                setUser(res.response);
                callback();
            } else {
                console.log("profile updating error: ", res.message);
            }
        })
    }

    onSavePlayer = () => {
        const { skinColor, accessory, nailColor, spadezDeck, spadezTable } = this.state;
        const { auth, setUser, navigation } = this.props;

        const profileData = { skinColor, accessory, nailColor, spadezDeck, spadezTable };
        apiService.updateProfileForUser(auth.user, profileData, (res) => {
            if (res.isSuccess) {
                AsyncStorage.setItem('USER', JSON.stringify(res.response));
                setUser(res.response);
                showToast('Profile is saved successfully!');
            } else {
                showToast('Saving Profile Failed!');
            }
        })
    }

    getBtnStyle(id, length) {
        if (id === 0) {
            return styles.typeViewBtnLeft
        }
        else if (id === length - 1) {
            return styles.typeViewBtnRight
        }
        else {
            return styles.typeViewBtnMiddle
        }
    }

    render() {
        const { skinColor, accessory, nailColor, spadezDeck, spadezTable, playerProps, loading } = this.state

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header onPress={() => this.props.navigation.pop()} bgColor={'#250901'} headerBorderWidth={2} imgLeft={images.ic_back} title={'EDIT PLAYER'} />
                    <ScrollView style={{ flexGrow: 1, height: '100%' }}>
                        <View style={{
                            alignItems: 'center',
                            marginTop: '4%',
                        }}>
                            <View style={styles.preview}>
                                <Text style={{ color: '#ffffff', fontFamily: 'Montserrat-Regular' }}>PREVIEW</Text>
                            </View>
                            <View style={{
                                marginTop: hp(1),
                                backgroundColor: '#250901',
                                height: hp(38),
                                width: wp(90),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: '#E83528',
                                borderRadius: 7,
                            }}>
                                <Image style={{ height: '80%', width: '80%', resizeMode: 'contain', }} source={images.hand_preview} />
                            </View>
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Choose skin color</Text>
                            </View>
                            <View style={styles.typeView}>
                                <View style={styles.typeInnerView}>
                                    {playerProps.skinColors && playerProps.skinColors.map((item, i) => {
                                        const btnStyle = this.getBtnStyle(i, playerProps.skinColors.length)
                                        const backgroundColor = skinColor === item.id ? 'red' : '#460000'
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({skinColor: item.id})}
                                                style={[btnStyle, { backgroundColor: backgroundColor }]}
                                            >
                                                <View style={[styles.colorBtn, {backgroundColor: item.value}]}/>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Nail Color</Text>
                            </View>
                            <View style={styles.typeView}>
                                <View style={styles.typeInnerView}>
                                    {playerProps.nailColors && playerProps.nailColors.map((item, i) => {
                                        const btnStyle = this.getBtnStyle(i, playerProps.nailColors.length)
                                        const backgroundColor = nailColor === item.id ? 'red' : '#460000'
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({nailColor: item.id})}
                                                style={[btnStyle, { backgroundColor: backgroundColor }]}
                                            >
                                                <View style={[styles.colorBtn, {backgroundColor: item.value}]}/>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Select Accessory</Text>
                            </View>
                            <View style={styles.typeView}>
                                <View style={styles.typeInnerView}>
                                    {playerProps.accessories && playerProps.accessories.map((item, i) => {
                                        const btnStyle = this.getBtnStyle(i, playerProps.accessories.length)
                                        const backgroundColor = accessory === item.id ? 'red' : '#460000'
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({accessory: item.id})}
                                                style={[btnStyle, { backgroundColor: backgroundColor }]}
                                            >
                                                <Text style={styles.textBtn}>{item.value}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Choose Spadez Deck</Text>
                            </View>
                            <View style={styles.typeView}>
                                <View style={styles.typeInnerView}>
                                    {playerProps.spadezDecks && playerProps.spadezDecks.map((item, i) => {
                                        const btnStyle = this.getBtnStyle(i, playerProps.spadezDecks.length)
                                        const backgroundColor = spadezDeck === item.id ? 'red' : '#460000'
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({spadezDeck: item.id})}
                                                style={[btnStyle, { backgroundColor: backgroundColor }]}
                                            >
                                                <Image style={{ height: '100%', width: '100%', resizeMode: 'contain', transform: [{ rotate: "90deg" }] }} source={item.value} />
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Choose Spadez Table</Text>
                            </View>
                            <View style={styles.typeView}>
                                <View style={styles.typeInnerView}>
                                    {playerProps.spadezTables && playerProps.spadezTables.map((item, i) => {
                                        const btnStyle = this.getBtnStyle(i, playerProps.spadezTables.length)
                                        const backgroundColor = spadezTable === item.id ? 'red' : '#460000'
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => this.setState({spadezTable: item.id})}
                                                style={[btnStyle, { backgroundColor: backgroundColor }]}
                                            >
                                                <View style={[styles.colorBtn, {backgroundColor: item.value}]}/>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.viewBottom}>
                                <SimpleButton
                                    onPress={this.onSavePlayer}
                                    btnHeight={hp(6)}
                                    btnWidth={wp(75)}
                                    textColor={'#000000'} title={'SAVE'}
                                    loading={loading}
                                />
                            </View>
                        </View>
                    </ScrollView>
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
        width: wp(100),
        alignItems: 'center'
        // backgroundColor:'#881000',
    },
    text: {
        fontSize: wp(3.6),
        // fontWeight:'bold',
        color: '#fff',
        textAlign: 'center',
        paddingTop: '2%',
        fontFamily: 'Montserrat-Regular'
    },
    textView: {
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'green'
    },
    typeView: {
        alignItems: 'flex-start'
    },
    typeInnerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(5),
        width: wp(80),
        // backgroundColor: 'green',
        borderTopLeftRadius: wp(5),
        borderBottomLeftRadius: wp(5),
        borderTopRightRadius: wp(5),
        borderBottomRightRadius: wp(5)
    },
    typeViewBtnLeft: {
        backgroundColor: 'red',
        height: '100%',
        width: wp(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: wp(5),
        borderBottomLeftRadius: wp(5),
    },
    typeViewBtnRight: {
        backgroundColor: '#460000',
        height: '100%',
        width: wp(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: wp(5),
        borderBottomRightRadius: wp(5)
    },
    typeViewBtnMiddle: {
        backgroundColor: '#460000',
        height: '100%',
        width: wp(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: '#fff',
        fontSize: wp(3.6),
        fontFamily: 'Montserrat-Bold'
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
    viewBottom: {
        height: hp(15),
        // backgroundColor:'gold',
        justifyContent: 'flex-start',
        marginTop: hp(6),
    },
    colorBtn: {
        width: '60%',
        height: '60%',
        borderRadius: 12
    }
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (params) => dispatch(setUserAction(params)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.login.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPlayer)
