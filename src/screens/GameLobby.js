import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import SimpleButton from '../common/SimpleButton';
import { connect } from 'react-redux'
import {
    setPreferences,
} from '../actions/preference'

class GameLobby extends React.Component {

    onGameLobbyOptionSelected (gameLobby) {
        const preferences = { gameLobby };
        const { userid } = this.props.auth;
        this.props.setPreferences(userid, preferences)
            .then(() => {
                if (this.props.preference.privateMatch) {
                    this.props.navigation.navigate('SpadezCrew')
                }
                else {
                    this.props.navigation.navigate('Original')
                }
            })
    }

    render() {
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer}>
                <Header
                    onPress={() => this.props.navigation.goBack()} onPressRight={() => this.props.navigation.navigate('Setting')}
                    bgColor={'#460000'} title={'GAMENIGHT SPADEZ'} headerBorderWidth={2}  imgRightColor={'#EFC76C'} imgLeft={images.ic_back}  imgRight={images.ic_settings}/>
                <View style={styles.textView}>
                 <Text style={styles.text}>SELECT GAME LOBBY</Text>
                </View>
                <View style={styles.btnView}>
                    <View>
                    <SimpleButton
                        onPress={() => this.onGameLobbyOptionSelected(200)}
                        title={'$200 GAME LOBBY'}/>
                    </View>
                    <View style={{marginTop:'6%'}}>
                    <SimpleButton
                        onPress={() => this.onGameLobbyOptionSelected(1000)}
                         title={'$1,000 GAME LOBBY'}/>
                    </View>
                    <View style={{marginTop:'6%'}}>
                    <SimpleButton
                        onPress={() => this.onGameLobbyOptionSelected(2000)}
                        title={'$2,000 GAME LOBBY'}/>
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
    text:{
        fontSize:wp(4.5),
        color:'#fff',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    textView:{
          height:hp(10),
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor: 'green'
    },
    btnView:{
        alignItems: 'center',
        height: hp(81),
        // backgroundColor:'pink'
    }
});

const mapDispatchToProps = (dispatch) => ({
    setPreferences: (userid, preferences) => dispatch(setPreferences(userid, preferences)),
    dispatch
})

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(GameLobby)
