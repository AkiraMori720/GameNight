import React from 'react';
import { connect } from 'react-redux'
import {View, StyleSheet, SafeAreaView, FlatList, Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import InputComponent from '../common/InputComponent';
import firestore from "@react-native-firebase/firestore";
import debounce from "../common/debounce";
import ActivityIndicator from "../Component/ActivityIndicator";
import equal from 'deep-equal';
import Character from "../Component/Character";
import RankingComponent from "../common/RankingComponent";

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            searchWord: '',
            players: [],
            searchPlayers: [],
            selectFriends: [],
            loading: false
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

    init = () => {
        if(this.unSubscribe){
            this.unSubscribe();
        }

        let friends = [];
        try{
            friends =  this.props.auth.friends?JSON.parse(this.props.auth.friends):[];
        } catch {}

        this.unSubscribe = firestore()
            .collection('userProfile')
            .orderBy('score', 'desc')
            .onSnapshot((snapshot => {
                let players = [];
                let curRank = 0;
                let curRankScore = -1000000;
                snapshot.docs.forEach((doc, index )=> {
                    let user = doc.data();
                    console.log('players', user);
                    if(user.characterSelectedId){
                        const userCharacter = user.characters.find(item => item.id === user.characterSelectedId);

                        let userFriends = [];
                        try{
                            userFriends =  user.friends?JSON.parse(user.friends):[];
                        } catch {}

                        if(curRankScore !== (user.score??0)){
                            curRankScore = (user.score??0);
                            curRank++;
                        }

                        const player = {
                            id: user.userid,
                            rank: curRank,
                            character: userCharacter,
                            is_friend: friends.includes(user.userid)??false,
                            friends: userFriends,
                            score: user.score,
                            fcmToken: user.fcmToken
                        }
                        players.push(player);
                    }
                });
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

    _player = item => {
        return (
            <RankingComponent
                rank={item.rank}
                imgLeft={
                    <Character
                        gender={item.character.gender}
                        shape={item.character.shape}
                        skin={item.character.skin}
                        hair={item.character.hair}
                        eyerow={item.character.eyerow}
                        eye={item.character.eye}
                        nose={item.character.nose}
                        lip={item.character.lip}
                    />
                }
                title={item.character.firstName + ' ' + item.character.lastName}
                score={item.score}
                onPress={() => {}}
            />
        );
    };


    render() {
        const { searchWord, players, searchPlayers, loading } = this.state;
        let list = searchWord.length > 0?searchPlayers:players;
        return(
            <SafeAreaView style={{flex:1}}>
                { loading? <ActivityIndicator absolute={true} size={'large'}/>:null }
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.goBack()}
                        bgColor={'#250901'} title={'LEADERBOARD'} headerBorderWidth={0} imgLeftColor={'#fff'} imgRightColor={'#EFC76C'} imgLeft={images.ic_back} />
                    <View style={styles.searchView}>
                        <InputComponent placeholder={'Search'} placeholderTextColor={'#444444'} textColor={'#000000'} imgRight={images.ic_search} inputHeight={hp(6)} onChangeText={(txt) => this.onChangeText(txt)}/>
                    </View>
                    <View style={styles.flatView}>
                        <View style={styles.listHeader}>
                            <Text style={styles.headerStyle}>RANK</Text>
                            <Text style={[styles.headerStyle, { flexGrow: 1 }]}>NAME</Text>
                            <Text style={styles.headerStyle}>SCORE</Text>
                        </View>
                         <View style={styles.innerFlatView}>
                             <FlatList showsVerticalScrollIndicator={false}
                                 keyExtractor={item => item.id}
                                 data={list}
                                 renderItem={({item}) => this._player(item)}
                             />
                         </View>
                    </View>
                </View>
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
    listHeader: {
        marginTop:'4%',
        flexDirection: 'row',
        alignItems: 'center',
        width:'90%',
        paddingVertical: '1%'
    },
    headerStyle: {
        paddingHorizontal:wp(3.5),
        color: 'white',
        fontWeight: 'bold'
    },
    innerFlatView:{
        height:'88%',
        width:'90%',
        borderWidth:3,
        borderColor:'#E83528',
        borderRadius:7,
        // backgroundColor:'#292411'
    }
});

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.login.profile
})


export default connect(mapStateToProps, null)(LeaderBoard)
