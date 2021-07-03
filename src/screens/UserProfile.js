import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Modal,
    ScrollView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { connect } from 'react-redux'
import {
    updatePreferenceStore as updatePreferenceStoreAction,
} from '../actions/preference'
import apiService from "../firebase/FirebaseHelper";
import { setUser as setUserAction } from "../actions/login";
import {getCharacterAvatar} from "../common/character";
import {showToast} from "../common/info";
import Character from "../Component/Character";
import equal from 'deep-equal';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            characters: [],
            character: {},
            characterSelectedId: null,
            age: 22,
        }
        this.setCharacter();
    };

    componentDidMount() {
        this.mounted = true;
        const { auth, updatePreferenceStore } = this.props;
        const { userid } = auth;

        // fetch user's preferences from firebase
        apiService.getPreferencesForUser(userid, (res) => {
            console.log('res--->>', res)
            if (res.isSuccess) {
                updatePreferenceStore(res.response);
            } else {
                console.log('failed: ', res.message)
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!equal(prevProps.auth, this.props.auth)){
            this.setCharacter();
        }
    }

    setCharacter = () => {
        const { characterSelectedId, characters } = this.props.auth;
        if(!characterSelectedId || !characters){ return; }
        let character = Object.assign({}, characters.find(item => item.id === characterSelectedId));
        if(this.mounted){
            this.setState({ characters, character, characterSelectedId });
        } else{
            this.state.characters = characters;
            this.state.character = character;
            this.state.characterSelectedId = characterSelectedId;
        }
    }

    onEditPlayer = () => {
        this.props.navigation.navigate('EditPlayer')
    };

    selectAvatar = (characterId) => {
        const { auth, setUser, navigation } = this.props;
        const { characterSelectedId } = this.state;
        if(characterSelectedId === characterId){
            return;
        }
        apiService.updateProfileForUser(auth.user,{characterSelectedId: characterId}, (res) => {
            if (res.isSuccess) {

            } else {
                console.log('error', res.message);
                showToast('Saving Profile Failed!');
            }
        });
    }

    onAddCharacter = () => {
        this.props.navigation.navigate('EditProfile');
    };

    onEditCharacter = () => {
        let profile = this.state.character;
        this.props.navigation.navigate('EditAvatar', {profile});
    }

    onRemoveCharacter = () => {
        const { auth, setUser } = this.props;
        const { characterSelectedId, characters } = this.state;

        let newCharacters = characters.filter(item => item.id !== characterSelectedId);
        let newSelectedId = null;
        if(newCharacters.length !== 0){
            newSelectedId = newCharacters[0].id;
        }

        apiService.updateProfileForUser(auth.user, { characterSelectedId: newSelectedId, characters: newCharacters }, (res) => {
            if(res.isSuccess){
                if(newCharacters.length === 0){
                    this.props.navigation.navigate('EditProfile');
                }
                showToast('Profile is removed successfully');
            } else {
                showToast('Removing Profile Failed!');
            }
        });

    }

    render() {
        const { characterSelectedId, characters, character } = this.state;
        const characterAvatar = getCharacterAvatar(character);
        console.log('characterAvatar', characters, characterAvatar);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.navigate('GameType')} onPressRight={() => this.props.navigation.navigate('Setting')}
                        bgColor={'#250901'} title={'USER PROFILE'} headerBorderWidth={2} imgLeft={images.ic_controller} imgRight={images.ic_settings} />
                    <View style={styles.container}>
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
                            <View style={styles.img}>
                                {character && <Character
                                    gender={character.gender}
                                    shape={character.shape}
                                    skin={character.skin}
                                    hair={character.hair}
                                    eyerow={character.eyerow}
                                    eye={character.eye}
                                    nose={character.nose}
                                    lip={character.lip}
                                />}
                            </View>
                            <TouchableOpacity onPress={this.onEditPlayer}>
                                <Image style={styles.icon} source={images.ic_edit_2} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textHeading}>{character.firstName + " " + character.lastName}</Text>
                            <Text style={styles.text}>{character.location}</Text>
                        </View>
                    </View>


                    <View style={{
                        alignItems: 'center',
                    }}>
                        <View style={styles.viewAvatar}>
                            <Text style={{ color: '#ffffff', fontFamily: 'Montserrat-Regular' }}>MY AVATARS</Text>
                        </View>
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
                                    <TouchableOpacity onPress={this.onEditCharacter}>
                                        <Image style={{ height: hp(4), width: wp(4.2), resizeMode: 'contain', tintColor: '#fff' }} source={images.ic_edit_2} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onRemoveCharacter} style={{ marginLeft: '4%' }}>
                                        <Image style={{ height: hp(4), width: wp(3.5), resizeMode: 'contain', tintColor: '#fff' }} source={images.ic_delete_2} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: '38%', marginTop: '4%', marginLeft: '3%', }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                    {characters.map((c, i) => {
                                        return (
                                            <TouchableOpacity style={styles.avatarContainer} key={i} onPress={() => this.selectAvatar(c.id)}>
                                                <>
                                                    <View style={styles.selectImg}>
                                                        <Character
                                                            gender={c.gender}
                                                            shape={c.shape}
                                                            skin={c.skin}
                                                            hair={c.hair}
                                                            eyerow={c.eyerow}
                                                            eye={c.eye}
                                                            nose={c.nose}
                                                            lip={c.lip}
                                                        />
                                                    </View>
                                                    {  characterSelectedId === c.id ? <Image style={[styles.genderCheck,{height:hp(5)},{width: wp(5), resizeMode: 'contain'}]} source={images.ic_player_check} /> : null}
                                                </>
                                            </TouchableOpacity>
                                        )})}
                                </ScrollView>
                            </View>
                            <TouchableOpacity onPress={this.onAddCharacter}>
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
        alignItems: 'center',
        // tintColor:'#fff',
    },
    selectImg: {
        height: 60,
        width: 60,
        alignItems: 'center',
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
    avatarContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 20,
        borderRadius: 8,
        backgroundColor: 'white',
        borderColor: '#fae31a',
        borderWidth: 2,
        marginEnd: wp(3),
    },
    image: {
        width: 60,
        height: 60,
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
    genderCheck: {
        position: 'absolute',
        right: -8,
        bottom: -16
    }
});

const mapDispatchToProps = (dispatch) => ({
    updatePreferenceStore: (value) => dispatch(updatePreferenceStoreAction(value)),
    setUser: (params) => dispatch(setUserAction(params)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.login.profile,
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
