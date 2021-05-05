import React from 'react';
import { connect } from 'react-redux'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import InputComponent from '../common/InputComponent';
import PlayerComponent from '../common/PlayerComponent';
import gameServices from '../firebase/gameService';


class SpadezCrew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomid: '',
            searchWord: '',
            showAlert: false,
            links: [
                {
                    id: 0,
                    imgLeft: images.ic_avatar_boy,
                    title:'Sandy Jane',
                    imgRight:images.ic_profile_game_badge,

                },
                {
                    id: 1,
                    imgLeft:images.ic_boy,
                    title:'Sarrah Mitchell ',
                    imgRight:images.ic_delete,
                },
                {
                    id: 2,
                    imgLeft:images.ic_avatar_boy,
                    title:'Jane',
                    imgRight:images.ic_profile_game_badge,

                },
                {
                    id:3,
                    imgLeft:images.ic_avatar_boy,
                    title:'John',
                    imgRight:images.ic_profile_game_badge,

                },

            ]
        }
    }

    componentDidMount () {
        const preference = this.props.preference
        const auth = this.props.auth

        if (preference !== undefined && auth !== undefined){
            const mode = Math.floor(Math.random() * 2)
            const randomMode = mode == 0 ? 'solo' : 'partner'
            const data = {
                name: auth.username,
                gameType: preference.gameType === 'random' ? randomMode : preference.gameType,
                gameStyle: preference.gameStyle,
                gameLobby: preference.gameLobby,
                winningScore: preference.gameStyle === 'solo' ? preference.soloPoints : preference.partnerPoints,
            }
            console.log('data: ', data);
            gameServices.createPrivateGame(data, (res) => {
                if (res.isSuccess) { this.setState({ roomid: res.response.roomid }) }
                else { console.log(res.message) }
            })
        }
    }

    onChangeText (txt) {
        console.log(txt)
        this.setState({
            searchWord: txt
        })
    }

    onNavigate (id) {
        console.log("ID-->",id);
        if(id===0){
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }else if(id===1){
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }
        else if (id===2) {
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }
        else if (id===3) {
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }
        else if (id===4) {
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }
        else if (id===5) {
            this.props.navigation.navigate('Original', { fPrivate: true, roomid: this.state.roomid })
        }
        else {
            // this._signOut()
        }
    }

    _player = item => {
        const searchWord = this.state.searchWord
        return (
            (item.title.indexOf(searchWord) >= 0) &&
            <PlayerComponent
                imgLeft={item.imgLeft}
                title={item.title}
                imgRight={item.imgRight}
                onPress={() => this.onNavigate(item.id)}

            />
        );
    };


    render() {
        const searchWord = this.state.searchWord
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.goBack()}
                        bgColor={'#250901'} title={'GAMENIGHT SPADEZ'} headerBorderWidth={0} imgLeftColor={'#fff'} imgRightColor={'#EFC76C'} imgLeft={images.ic_back} />
                    <View style={styles.searchView}>
                    <InputComponent placeholder={'Search'} placeholderTextColor={'#000000'} imgRight={images.ic_search} value={searchWord} onChangeText={(txt) => this.onChangeText(txt)}/>
                    </View>
                    <View style={styles.flatView}>
                     <View style={styles.innerFlatView}>
                         <FlatList showsVerticalScrollIndicator={false}
                             keyExtractor={item => item.id}
                             data={this.state.links}
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
        height: hp(7),
    },
    flatView:{
        height:hp(83),
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
    }
});

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.auth
})

export default connect(mapStateToProps)(SpadezCrew)