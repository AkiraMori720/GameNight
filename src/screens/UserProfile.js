import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { ScrollView } from 'react-navigation';
import InputComponent from "../common/InputComponent";
import AvatarCompo from '../common/AvatarCompo';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux'
import {
    updateAuthInfo,
    updateProfileForUser
} from '../actions/auth'
import {
    getPreferences,
} from '../actions/preference'

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showProfileEditModal: false,
            showAvatarAddModal: false,
            username: 'PATRICIA MILLER',
            age: 22,
            address: '121, Cherry Bridge, NY',
            avatarId: 3,
            avatars: [images.ic_bear, images.ic_bird, images.ic_avatar0, images.ic_avatar_boy]
        }
    };

    componentDidMount() {
        debugger;
        const { userid } = this.props.auth

        // fetch user's preferences from firebase
        this.props.getPreferences(userid)
    }

    accept() {
        this.setState({ showProfileEditModal: false, showAvatarAddModal: false });
        // this.props.navigation.navigate('Introduction')
    }

    cancel() {
        this.setState({ showProfileEditModal: false, showAvatarAddModal: false });
    }

    term() {
        this.setState({ showProfileEditModal: false, showAvatarAddModal: false });
        // this.props.navigation.navigate('Terms')
    }

    privacy() {
        this.setState({ showProfileEditModal: false, showAvatarAddModal: false });
        // this.props.navigation.navigate('Privacy')
    }

    toggleProfileEditModal = () => {
        this.props.navigation.navigate('EditProfile')
        // this.setState({ showProfileEditModal: !this.state.showProfileEditModal });
    };

    selectAvatar = (idx) => {
        this.props.updateProfileForUser({avatarId: idx})
    }

    toggleAvatarAddModal = () => {
        // this.setState({ showAvatarAddModal: !this.state.showAvatarAddModal });
        this.addAvatar();
    };

    addAvatar = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {

            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                this.setState({
                    avatars: [...this.state.avatars, response]
                });
            }
        });
    };

    render() {
        const { avatarId, avatars } = this.props.auth
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.navigate('GameType')} onPressRight={() => this.props.navigation.navigate('Setting')}
                        bgColor={'#250901'} title={'USER PROFILE'} headerBorderWidth={2} imgLeft={images.ic_controller} imgRight={images.ic_settings} />
                    <View style={styles.container}>
                        <Modal
                            visible={this.state.showProfileEditModal}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.toggleProfileEditModal}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                                <View style={{
                                    width: wp('80%'),
                                    height: hp('40%'),
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}>


                                    <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: wp('6%'), fontWeight: 'bold', marginTop: wp('5%'), color: '#000000', }}>Edit your profile now!</Text>
                                        <View style={{ marginLeft: wp(5), marginRight: wp(5), marginTop: wp(5) }}>
                                            <InputComponent
                                                secureTextEntry={false}
                                                inputPadding={wp(2)}
                                                inputHeight={hp(6)}
                                                inputWidth={wp(70)}
                                                inputRadius={wp(5)}
                                                bgColor={'grey'}
                                                placeholder={'Name'}
                                                placeholderTextColor={'#fff'}
                                                onChangeText={username => this.setState({ username })}
                                                value={this.state.username}
                                            />
                                        </View>
                                        <View style={{ marginLeft: wp(5), marginRight: wp(5), marginTop: wp(5) }}>
                                            <InputComponent
                                                secureTextEntry={false}
                                                inputPaddingLeft={wp(2)}
                                                inputHeight={hp(6)}
                                                inputWidth={wp(70)}
                                                inputRadius={wp(10)}
                                                bgColor={'grey'}
                                                placeholder={'Age'}
                                                placeholderTextColor={'#fff'}
                                                onChangeText={age => this.setState({ age })}
                                                value={this.state.age + ''}
                                            />
                                        </View>
                                        <View style={{ marginLeft: wp(5), marginRight: wp(5), marginTop: wp(5) }}>
                                            <InputComponent
                                                secureTextEntry={false}
                                                inputPaddingLeft={wp(2)}
                                                inputHeight={hp(6)}
                                                inputWidth={wp(70)}
                                                inputRadius={wp(10)}
                                                bgColor={'grey'}
                                                placeholder={'Address'}
                                                placeholderTextColor={'#fff'}
                                                onChangeText={address => this.setState({ address })}
                                                value={this.state.address}
                                            />
                                        </View>
                                    </View>

                                    {/*Buttons*/}
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <View style={{ marginLeft: wp('5%') }}>

                                            <TouchableOpacity onPress={() => this.accept()} style={{
                                                width: wp('30%'), height: hp('5%'),
                                                // backgroundColor:'grey',
                                                borderRadius: 5,
                                                justifyContent: 'center', alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: 'grey'


                                            }}>
                                                <Text style={{ color: '#E83528', fontSize: wp('4%'), }}>Agree</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginRight: wp('5%') }}>
                                            <TouchableOpacity onPress={() => this.cancel()} style={{
                                                width: wp('30%'), height: hp('5%'),
                                                backgroundColor: 'white',
                                                borderColor: 'grey',
                                                borderRadius: 5,
                                                justifyContent: 'center', alignItems: 'center',
                                                borderWidth: 1,

                                            }}>
                                                <Text style={{ color: '#E83528', fontSize: wp('4%'), }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={styles.containerImg}>
                            <View style={{ marginTop: hp(1) }}>
                                <Text style={{
                                    fontSize: wp(6),
                                    fontFamily: 'Montserrat-Bold',
                                    color: 'gold'
                                }}>{this.state.age}</Text>
                                <Text style={{
                                    fontSize: wp(3.5),
                                    color: 'gold',
                                    fontFamily: 'Montserrat-Light',
                                    textAlign: 'center',
                                    paddingBottom: wp(0),
                                }}>Crew</Text>
                            </View>
                            <Image style={styles.img} source={avatars[avatarId]} />
                            <TouchableOpacity onPress={this.toggleProfileEditModal}>
                                <Image style={styles.icon} source={images.ic_edit_2} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textHeading}>{this.state.username + ", " + this.state.age}</Text>
                            <Text style={styles.text}>{this.state.address}</Text>
                        </View>
                    </View>


                    <View style={{
                        alignItems: 'center',
                    }}>
                        <View style={styles.viewAvatar}>
                            <Text style={{ color: '#ffffff', fontFamily: 'Montserrat-Regular' }}>MY AVATARS</Text>
                        </View>

                        <Modal
                            visible={this.state.showAvatarAddModal}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.toggleAvatarAddModal}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                                <View style={{
                                    width: wp('80%'),
                                    height: hp('25%'),
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}>


                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>

                                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', width: wp('75%'), justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.term()}>
                                                <Text style={{ color: '#C42D3E', fontSize: wp('4%'), fontWeight: 'bold', textDecorationLine: 'underline', }}>
                                                    AVATARS
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: wp('4%'), fontWeight: 'bold', color: '#000000', }}> and </Text>
                                            <TouchableOpacity onPress={() => this.privacy()}>
                                                <Text style={{ color: '#C42D3E', fontSize: wp('4%'), fontWeight: 'bold', textDecorationLine: 'underline', }}>
                                                    AVATARS
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ fontSize: wp('4%'), fontWeight: 'bold', marginTop: wp('-10%'), color: '#000000', }}>avatar, region, name</Text>


                                    </View>

                                    {/*Buttons*/}
                                    <View
                                        style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ marginLeft: wp('2%') }}>

                                            <TouchableOpacity onPress={() => this.accept()} style={{
                                                width: wp('36%'), height: hp('7%'),
                                                // backgroundColor:'grey',
                                                borderRadius: 5,
                                                justifyContent: 'center', alignItems: 'center',
                                                borderWidth: 1,
                                                borderColor: 'grey'


                                            }}>
                                                <Text style={{ color: '#E83528', fontSize: wp('4%'), }}>Agree</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginRight: wp('2%') }}>
                                            <TouchableOpacity onPress={() => this.cancel()} style={{
                                                width: wp('36%'), height: hp('7%'),
                                                backgroundColor: 'white',
                                                borderColor: 'grey',
                                                borderRadius: 5,
                                                justifyContent: 'center', alignItems: 'center',
                                                borderWidth: 1,

                                            }}>
                                                <Text style={{ color: '#E83528', fontSize: wp('4%'), }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <View style={{
                            marginTop: hp(1),
                            backgroundColor: '#250901',
                            height: hp(38),
                            width: wp(90),
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderWidth: 3,
                            borderColor: '#E83528',
                            borderRadius: 7,
                        }}>


                            <View style={{ height: '17%', width: '80%', justifyContent: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>

                                    <TouchableOpacity>
                                        <Image style={{ height: hp(4), width: wp(4.2), resizeMode: 'contain', tintColor: '#fff' }} source={images.ic_edit_2} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginLeft: '4%' }}>
                                        <Image style={{ height: hp(4), width: wp(3.5), resizeMode: 'contain', tintColor: '#fff' }} source={images.ic_delete_2} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: '38%', marginTop: '4%', marginLeft: '3%', }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                    {avatars.map((avatar, i) => {
                                        return (
                                            <TouchableOpacity key={i} onPress={() => this.selectAvatar(i)}>
                                                <Image style={styles.image} source={avatar} />
                                            </TouchableOpacity>
                                        )})}
                                </ScrollView>
                            </View>
                            <TouchableOpacity onPress={this.toggleAvatarAddModal}>
                                <Image style={{ height: hp(15), width: wp(15), resizeMode: 'contain', }} source={images.ic_add} />
                            </TouchableOpacity>
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
    container: {
        justifyContent: 'center',
        height: hp(40),
        backgroundColor: '#691201',
        margin: '5%',
    },
    containerImg: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(15)
    },
    containerText: {
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: wp(3),
        marginTop: hp(2)
    },
    img: {
        height: hp(15),
        width: wp(25),
        resizeMode: 'contain',
        // tintColor:'#fff',
    },
    icon: {
        height: hp(7),
        width: wp(6.5),
        resizeMode: 'contain',
        tintColor: 'gold',
    },
    textHeading: {
        fontSize: wp(4),
        fontFamily: 'Montserrat-Bold',
        color: '#fff',
        textAlign: 'center',
        paddingBottom: wp(1),
    },
    text: {
        fontSize: wp(3),
        // fontWeight:'bold',
        color: '#fff',
        textAlign: 'center',
        paddingBottom: hp(0.5),
        fontFamily: 'Montserrat-Light',

    },
    image: {
        height: hp(10),
        width: wp(18),
        marginStart: wp(2),
        resizeMode: 'contain',
    },
    viewAvatar: {
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
});

const mapDispatchToProps = (dispatch) => ({
    updateAuthInfo: (value) => dispatch(updateAuthInfo(value)),
    getPreferences: (value) => dispatch(getPreferences(value)),
    updateProfileForUser: (value) => dispatch(updateProfileForUser(value)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
