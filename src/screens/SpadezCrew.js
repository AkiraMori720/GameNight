import React from 'react';
import { connect } from 'react-redux'
import {View, StyleSheet, SafeAreaView, FlatList, Modal, ImageBackground, Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import InputComponent from '../common/InputComponent';
import PlayerComponent from '../common/PlayerComponent';
import gameServices from '../firebase/gameService';
import SimpleButton from "../common/SimpleButton";
import firestore from "@react-native-firebase/firestore";
import {getCharacterAvatar} from "../common/character";
import debounce from "../common/debounce";
import {showToast} from "../common/info";
import FirebaseHelper from "../firebase/FirebaseHelper";
import FilterDropdown from "../Component/FilterDropdown";
import apiService from "../firebase/FirebaseHelper";
import {setUser as setUserAction} from "../actions/login";
import ActivityIndicator from "../Component/ActivityIndicator";
import equal from 'deep-equal';
import Character from "../Component/Character";

class SpadezCrew extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            searchWord: '',
            showAlert: false,
            players: [],
            searchPlayers: [],
            selectFriends: [],
            showFilterDropdown: false,
            showOnlyFriends: true,
            loading: false,
            showSelectPartner: false
        }

        this.init();
    }

    componentDidMount () {
        this.mounted = true;
    }

    componentWillUnmount() {
        if(this.unSubscribe){
            this.unSubscribe();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!equal(this.props.auth, prevProps.auth)){
            setTimeout(() => this.init());
        }
    }

    setInternalState = (newState) => {
        if(this.mounted){
            this.setState(newState);
        } else {
            this.state = { ...this.state, ...newState };
        }
    }

    onAddPlayer = (user) => {
        const { selectFriends } = this.state;
        if(selectFriends.includes(user.id)){
            this.setState({ selectFriends: selectFriends.filter(item => item !== user.id) });
        } else {
            if(selectFriends.length >= 3){
                return showToast('You can not select over three players!');
            }
            if(!user.is_friend){
                return showToast('This user is not your friend!');
            }

            selectFriends.push(user.id);
            this.setState({ selectFriends });
        }
    }

    init = () => {
        if(this.unSubscribe){
            this.unSubscribe();
        }

        let friends = [];
        try{
            friends =  this.props.auth.friends?JSON.parse(this.props.auth.friends):[];
        } catch {}

        this.unSubscribe = firestore()
            .collection('userProfile').onSnapshot((snapshot => {
                let players = [];
                snapshot.docs.forEach(doc => {
                    let user = doc.data();
                    if(user.characterSelectedId && user.userid !== this.props.auth.userid){
                        const userCharacter = user.characters.find(item => item.id === user.characterSelectedId);

                        let userFriends = [];
                        try{
                            userFriends =  user.friends?JSON.parse(user.friends):[];
                        } catch {}

                        const player = {
                            id: user.userid,
                            character: userCharacter,
                            is_friend: friends.includes(user.userid)??false,
                            friends: userFriends,
                            fcmToken: user.fcmToken
                        }
                        players.push(player);
                    }
                })
                this.setInternalState({ players })
            }))
    }

    onChangeText = debounce((txt) => {
        const searchText = txt.trim();
        const { players } = this.state;
        let searchPlayers = players.filter(player => {
            const name = player.character.firstName + ' ' + player.character.lastName;
            return name.indexOf(searchText) >= 0;
        })
        this.setState({
            searchWord: txt,
            searchPlayers
        })
    }, 200);

    _onPressStart = () => {
        const { selectFriends } = this.state;
        if(selectFriends.length !== 3){
            return showToast("Please select three players for playing game by clicking user`s avatar!");
        }

        const preference = this.props.preference;
        console.log('gameType', preference.gameType);
        if(preference.gameType === 'partner'){
            this.setState({ showSelectPartner: true });
        } else {
            this._startGame();
        }
    }

    _startGame = () => {
        const { selectFriends, players, selectPartner, showSelectPartner } = this.state;
        if(showSelectPartner && !selectPartner){
            return showToast('Please select your partner!');
        }
        this.setState({ showSelectPartner: false });
        const preference = this.props.preference;
        const auth = this.props.auth;

        let myCharacter = auth.characters.find(i => i.id === auth.characterSelectedId);
        let myName = myCharacter.firstName + ' ' + myCharacter.lastName;

        if (preference !== undefined){
            const data = {
                name: myName,
                gameType: preference.gameType,
                gameStyle: preference.gameStyle === 'random'?'partner':preference.gameStyle,
                gameLobby: preference.gameLobby,
                winningScore: preference.gameStyle === 'solo' ? preference.soloPoints : preference.partnerPoints,
                partners: selectPartner?[auth.userid, selectPartner]:null,
                private: true
            }

            console.log('data: ', data);
            gameServices.createGame(data, (res) => {
                if (res.isSuccess) {
                    let fcmTokens = players.filter(player => selectFriends.includes(player.id) && player.fcmToken).map(player => player.fcmToken);
                    FirebaseHelper.sendNotifications(res.response.roomid, fcmTokens, myName, { fPrivate: 1, roomid: res.response.roomid }).then(() => {
                        showToast('Notifications are sent to friends successfully');
                    });
                    this.props.navigation.navigate('Original', { fPrivate: true, roomid: res.response.roomid });
                }
                else {
                    console.log(res.message);
                }
            })
        }
    }

    onAction = (item) => {
        console.log('onAction', item);
        const { selectFriends } = this.state;
        const { userid, friends } = this.props.auth;
        // invited in game
        if(selectFriends.includes(item.id)){
            return;
        }

        this.setState({ loading: true });
        let userFriends = item.friends??[];
        let selfFriends = [];
        try{
            selfFriends =  friends?JSON.parse(friends):[];
        } catch {}

        // Is friend (Remove Action)
        if(item.is_friend){
            userFriends = userFriends.filter(i => i !== userid);
            selfFriends = selfFriends.filter(i => i !== item.id);
        // Not friend (Add Action)
        } else {
            userFriends.push(userid);
            selfFriends.push(item.id);
        }

        apiService.updateProfileForUser({uid: item.id}, { friends: JSON.stringify(userFriends) }, (res) => {
            if (res.isSuccess) {
                apiService.updateProfileForUser({uid: userid}, { friends: JSON.stringify(selfFriends) }, (res) => {
                    if (res.isSuccess) {
                        setTimeout(() => {
                            this.init();
                        }, 100);

                        if(item.is_friend){
                            showToast("The user was removed in friend list");
                        } else {
                            showToast("The user became your friend");
                        }
                        this.setState({ loading: false });
                    } else {
                        console.log("profile updating error: ", res.message);
                        showToast("Action failed!");
                        this.setState({ loading: false });
                    }
                })
            } else {
                console.log("profile updating error: ", res.message);
                showToast("Action failed!");
                this.setState({ loading: false });
            }
        });
    }

    _player = item => {
        const { selectFriends } = this.state;
        let imageRight = selectFriends.includes(item.id)?images.ic_profile_game_badge:(item.is_friend?images.ic_delete:images.ic_add);

        return (
            <PlayerComponent
                imgLeft={
                    <Character
                        gender={item.character.gender}
                        skin={item.character.skin}
                        hair={item.character.hair}
                        eyerow={item.character.eyerow}
                        eye={item.character.eye}
                        nose={item.character.nose}
                        lip={item.character.lip}
                    />
                }
                title={item.character.firstName + ' ' + item.character.lastName}
                imgRight={imageRight}
                onPress={() => this.onAddPlayer(item)}
                onActionPress={() => this.onAction(item)}
            />
        );
    };

    _gamePlayer = item => {
        const { selectPartner } = this.state;
        let imageRight = selectPartner === item.id?images.ic_checked:null;

        return (
            <PlayerComponent
                imgLeft={
                    <Character
                        gender={item.character.gender}
                        skin={item.character.skin}
                        hair={item.character.hair}
                        eyerow={item.character.eyerow}
                        eye={item.character.eye}
                        nose={item.character.nose}
                        lip={item.character.lip}
                    />
                }
                title={item.character.firstName + ' ' + item.character.lastName}
                imgRight={imageRight}
                onPress={() => this.setState({selectPartner: item.id})}
            />
        );
    }

    renderSelectPartner = () => {
        const { selectFriends, players } = this.state;
        let gamePlayers = players.filter(player => selectFriends.includes(player.id));
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('80%'),
                    height: hp('60%'),
                    backgroundColor: '#881000',
                    borderColor: '#E83528',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 8
                }}>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2), color: '#fff' }}>Please select your partner!</Text>
                    <View style={styles.modalFlatView}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.id}
                            data={gamePlayers}
                            renderItem={({item}) => this._gamePlayer(item)}
                        />
                    </View>
                    <View style={styles.modalBottom}>
                        <SimpleButton
                            onPress={() => this._startGame()}
                            btnHeight={hp(6)}
                            btnWidth={wp(75)}
                            textColor={'#000000'} title={'START'}
                        />
                    </View>
                </View>
            </View>
        );
    }


    render() {
        const { searchWord, players, searchPlayers, showFilterDropdown, showOnlyFriends, loading, showSelectPartner } = this.state;
        let list = searchWord.length > 0?searchPlayers:players;
        list = list.filter(item => !showOnlyFriends || (showOnlyFriends && item.is_friend));
        return(
            <SafeAreaView style={{flex:1}}>
                { loading? <ActivityIndicator absolute={true} size={'large'}/>:null }
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.goBack()}
                        bgColor={'#250901'} title={'GAMENIGHT SPADEZ'} headerBorderWidth={0} imgLeftColor={'#fff'} imgRightColor={'#EFC76C'} imgLeft={images.ic_back} imgRight={images.ic_dropdow} onPressRight={() => this.setState({showFilterDropdown: !showFilterDropdown})} />
                    <View style={styles.searchView}>
                        <InputComponent placeholder={'Search'} placeholderTextColor={'#444444'} textColor={'#000000'} imgRight={images.ic_search} inputHeight={hp(6)} onChangeText={(txt) => this.onChangeText(txt)}/>
                    </View>
                    <View style={styles.flatView}>
                         <View style={styles.innerFlatView}>
                             <FlatList showsVerticalScrollIndicator={false}
                                 keyExtractor={item => item.id}
                                 data={list}
                                 renderItem={({item}) => this._player(item)}
                             />
                         </View>
                        <View style={styles.viewBottom}>
                            <SimpleButton
                                onPress={() => this._onPressStart()}
                                btnHeight={hp(6)}
                                btnWidth={wp(75)}
                                textColor={'#000000'} title={'START'}
                            />
                        </View>
                    </View>
                    {showFilterDropdown ? (
                        <FilterDropdown
                            close={() => this.setState({showFilterDropdown: false})}
                            onlyFriends={showOnlyFriends}
                            showOnlyFriends={(value) => this.setState({showOnlyFriends: value})}
                        />
                    ) : null}
                </View>
                <Modal
                    visible={showSelectPartner}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => this.setState({showSelectPartner: false})}
                >
                    {this.renderSelectPartner()}
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        height:hp(100),
        width:wp(100),
        backgroundColor:'#881000',
    },
    searchView:{
        alignItems:'center',
        backgroundColor: '#250901',
        height: hp(8),
        zIndex: 100
    },
    flatView:{
        height:hp(82),
        alignItems:'center',
        // backgroundColor:'green'
    },
    innerFlatView:{
        height:'80%',
        width:'90%',
        marginTop:'4%',
        borderWidth:3,
        borderColor:'#E83528',
        borderRadius:7,
        // backgroundColor:'#292411'
    },
    viewBottom: {
        height: '20%',
        width:'90%',
        marginTop: hp(2),
        alignItems: 'center'
        // backgroundColor:'gold',
    },
    modalFlatView: {
        marginTop: hp(2),
    },
    modalBottom: {
        marginTop: hp(4),
        alignItems: 'center',
        height: '20%',
    }
});

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.login.profile
})

const mapDispatchToProps = (dispatch) => ({
    setUser: (params) => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(SpadezCrew)
