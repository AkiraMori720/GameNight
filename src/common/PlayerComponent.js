import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from '../../assets/images';


export default class PlayerComponent extends React.Component {

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
        // flex:1,
        // marginHorizontal:wp(4),
        alignItems:'center',
        // paddingTop:hp(1),
        // justifyContent: 'center'
    },
    container: {
        backgroundColor:"#250901",
        paddingHorizontal:wp(3.5),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: hp(10),
        // borderWidth:wp(0.1),
        // marginBottom:hp(0.5),
        // paddingBottom:wp(2),
        borderRadius:wp(0),
        width:wp(88),
        borderBottomWidth:3,
        borderColor:'#3a0803'

    },
    containerLogo:{
        flexDirection:'row',
        alignItems: 'center'
    },
    imgLeft: {
        height:hp(10),
        width:wp(15),
        resizeMode:'contain',
        // tintColor: '#fff'
    },
    text: {
        textAlign: 'center',
        marginStart:wp(4),
        color:'#fff',
        fontSize:wp(3.5),
        fontFamily: 'Montserrat-Light',
    },
    imgRight: {
        height:hp(4),
        width:wp(9),
        resizeMode:'contain',
        // tintColor: '#fff'
    },

});


