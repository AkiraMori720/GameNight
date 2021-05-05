import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class SettingLink extends React.Component {

    render() {
        return(
                <View style={styles.mainContainer}>
                <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                <View style={styles.containerLogo}>
                <Image style={styles.imgLeft} source={this.props.imgLeft} />
                <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View>
                <Image style={styles.imgRight} source={this.props.imgRight} />
                </View>
                </TouchableOpacity>
                </View>

        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        // marginHorizontal:wp(4),
        alignItems:'center',
        paddingTop:hp(1)
    },
    container: {
        backgroundColor:"#B40A1B",
        paddingHorizontal:wp(7),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: hp(7),
        // borderWidth:wp(0.1),
        // marginBottom:hp(0.5),
        // paddingBottom:wp(2),
        borderRadius:wp(7),
        width:wp(80),

    },
    containerLogo:{
        flexDirection:'row',
        alignItems: 'center'
    },
    imgLeft: {
        height:hp(4),
        width:wp(4),
        resizeMode:'contain',
        tintColor: '#fff'
    },
    text: {
        textAlign: 'center',
        marginStart:wp(3),
        color:'#fff',
        fontSize:wp(3.3),
        fontFamily:'Montserrat-Bold'
    },
    imgRight: {
        height:hp(2),
        width:wp(1.8),
        resizeMode:'contain',
        tintColor: '#fff'
    },

});


