import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SettingLink from './SettingLink';

import Header from '../common/Header';
import images from '../../assets/images';
import IconButton from '../common/IconButton';
import {logout as logoutAction} from "../actions/login";
import {connect} from "react-redux";

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            links: [
                {
                    id: 0,
                    imgLeft: images.ic_instructions,
                    title:'Introductions About the Game',
                    imgRight:images.ic_option,

                },
                {
                    id: 1,
                    imgLeft:images.ic_game_preference,
                    title:'Game Preferences',
                    imgRight:images.ic_option,
                },
                {
                    id: 2,
                    imgLeft:images.ic_music_volume,
                    title:'Music Volume',
                    imgRight:images.ic_option,

                },
                {
                    id: 3,
                    imgLeft:images.ic_sound_volume,
                    title:'Sound Volume',
                    imgRight:images.ic_option,

                },
                {
                    id:4,
                    imgLeft:images.ic_privacy,
                    title:'Privacy Policy',
                    imgRight:images.ic_option,

                },

            ]
        }
    }



    onNavigate (id){
        console.log("ID-->",id);
        if(id===0){

        }else if(id===1){
            this.props.navigation.navigate('GamePreferences')
        }
        else if (id===2) {

        }
        else if (id===3) {

        }
        else if (id===4) {
            this.props.navigation.navigate('Terms')
        }
        else if (id===5) {
            this.props.navigation.navigate('Privacy')
        }
        else {
            // this._signOut()
        }
    }

    _navigate ()   {
        const { logout, navigation } = this.props;
        navigation.popToTop();
        logout();
    };

    _settingLink = item => {
        return (
            <SettingLink
                imgLeft={item.imgLeft}
                title={item.title}
                imgRight={item.imgRight}
                onPress={() => this.onNavigate(item.id)}

            />
        );
    };

    render() {
        return(
            <View style={styles.mainContainer}>
                <Header onPress={() => this.props.navigation.goBack()} bgColor={'#460000'} headerBorderWidth={2} title={'SETTINGS'} imgLeftColor={'#fff'}  imgLeft={images.ic_back} />
                <View style={styles.flatView}>
                <FlatList
                keyExtractor={item => item.id}
                data={this.state.links}
                renderItem={({item}) => this._settingLink(item)}
                />
                </View>

                <View style={styles.btnView}>
                    <IconButton onPress={() => this._navigate()} imgLeft={images.ic_quit} fontSize={wp(3.5)} iconPaddingLeft={wp(7)} btnPaddingRight={wp(30)} btnWidth={wp(80)} bgColor={'#460000'}  textColor={'#fff'} title={'Quit'} />
                </View>

            </View>

        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logoutAction())
})

export default connect(null, mapDispatchToProps)(Setting);

const styles= StyleSheet.create({
    mainContainer: {
       flex:1,
       backgroundColor: '#881000',
    },
    container: {
        // backgroundColor:"#F4F4F4",
        paddingHorizontal:wp(3),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: hp(8),
        borderWidth:wp(0.1),
        // paddingBottom:wp(2)
    },
    containerLogo:{
        flexDirection:'row',
        alignItems: 'center'
    },
    img: {
        height:hp(5),
        width:wp(5),
        resizeMode:'contain',
        tintColor:'#fff',
    },
    text: {
        textAlign: 'center',
        marginStart:wp(2),
    },
    flatView: {
        paddingTop: hp(2),
    },
    btnView: {
        marginTop:hp(1),
        justifyContent:'center',
        alignItems:'center',
    },
    textTitle: {
        fontWeight:'bold',
        textAlign:'center',
        color:'#87202C',
    },
    modalContainer: {
        height:hp(32),
        width:wp(52),
        borderRadius:wp(3),
        backgroundColor: '#fff',
    },
    viewModalText:{
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(6),
        // backgroundColor:'green',
        borderTopLeftRadius: wp(3),
        borderTopRightRadius:wp(3),
    },
    viewRadioBtn:{
        height: hp(20),
        // backgroundColor:'orange',
        // paddingTop:hp(0),
        alignItems:'center',
    },
    viewInnerRadioBtn:{
        flexDirection:'row',
        justifyContent: 'space-between',
        // backgroundColor:'red',
        width: '80%',
        paddingTop:hp(1.5),
    },
    viewModalBtnUpper:{
        height: hp(5.5),
        // backgroundColor:'purple',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth:wp(0.2),
        borderColor:'grey',
    },
    viewModalBtn:{
        flexDirection:'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        height: hp(5.5),
        // backgroundColor:'blue',
        borderBottomLeftRadius: wp(3),
        borderBottomRightRadius:wp(3),
        borderTopWidth:wp(0.2),
        borderColor:'grey',
        // paddingHorizontal:'8%'
    },




});


