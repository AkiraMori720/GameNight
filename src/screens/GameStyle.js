import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import IconButton from '../common/IconButton';
import { connect } from 'react-redux'
import {
    setPreferences as setPreferencesAction,
} from '../actions/preference'
import { logout as logoutAction} from '../actions/login';

const gameStyes = [
    {
        id: 0,
        name: 'ACE OF SPADES AND DOWN',
        image: 'ic_ace_of_spades_down'
    },
    {
        id: 1,
        name: 'JOKERS W/ DEUCE OF DIAMOND',
        image: 'ic_ace_of_spades_down'
    },
    {
        id: 2,
        name: 'JOKERS W/O DEUCE OF DIAMOND',
        image: 'ic_ace_of_spades_down'
    },
]

class GameStyle extends React.Component {

    onGameStyleOptionSelected (gameStyle) {
        const preferences = { gameStyle }
        const { userid } = this.props.auth
        
        this.props.setPreferences({userId: userid, preferences});
        this.props.navigation.navigate('GameLobby');
    }

    renderStyleButtons () {
        return (
                
            <View style={styles.btnView}>
                {
                    gameStyes.map(style => {
                        if (style.id === 0) {
                            return (
                                <View key={style.id}>
                                    <IconButton
                                        onPress={() => this.onGameStyleOptionSelected(style.id)}
                                        imgLeft={images.ic_ace_of_spades_down}
                                        textColor={'#000000'}
                                        btnWidth={wp(80)}
                                        iconHeight={hp(20)}
                                        iconWidth={wp(20)}
                                        title={style.name}
                                        textPaddingLeft={wp(12)}
                                        fontSize={wp(3.5)}
                                        btnHeight={hp(6)}
                                    />
                                </View>
                            )
                        } else {
                            return (
                                <View key={style.id}  style={{marginTop:'13%'}}>
                                    <IconButton
                                        onPress={() => this.onGameStyleOptionSelected(style.id)}
                                        imgLeft={images.ic_ace_of_spades_down}
                                        textColor={'#000000'}
                                        btnWidth={wp(80)}
                                        iconHeight={hp(20)}
                                        iconWidth={wp(20)}
                                        title={style.name}
                                        textPaddingLeft={wp(12)}
                                        fontSize={wp(3.5)}
                                        btnHeight={hp(6)}
                                    />
                                </View>
                            )
                        }

                        
                    })
                }    
            </View>
            
        )
    }

    render() {
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.goBack()} onPressRight={() => this.props.navigation.navigate('Setting')}
                        bgColor={'#460000'} title={'GAMENIGHT SPADEZ'} imgLeftColor={'#fff'} headerBorderWidth={2}  imgLeft={images.ic_back}  imgRight={images.ic_settings}/>
                    <View style={styles.textView}>
                        <Text style={styles.text}>GAMES STYLES</Text>
                    </View>
                    {this.renderStyleButtons()}

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
    setPreferences: (params) => dispatch(setPreferencesAction(params)),
    logout: () => dispatch(logoutAction()),
    dispatch
})

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.login.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(GameStyle)
