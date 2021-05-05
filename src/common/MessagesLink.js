import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class MessagesLink extends React.Component {

    render() {
        return(
            <View style={styles.mainContainer}>
                <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                    <View style={styles.containerLogo}>
                        <Image style={styles.img} source={this.props.imgLeft} />
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                    <View>
                        <Image style={styles.img} source={this.props.imgRight} />
                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        marginHorizontal:wp(4),
        paddingTop:hp(1.5),
    },
    container: {
        backgroundColor:"#fff",
        paddingHorizontal:wp(3),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: hp(8),
        // borderWidth:wp(0.1),
        // marginBottom:hp(0.5),
        // paddingBottom:wp(2),
    },
    containerLogo:{
        flexDirection:'row',
        alignItems: 'center'
    },
    img: {
        height:hp(5),
        width:wp(5),
        resizeMode:'contain',
        // tintColor:'#87202C',
    },
    text: {
        textAlign: 'center',
        marginStart:wp(2),
        color:'#87202C',
        fontFamily:'Proxima_Nova_Semibold'
    }




});


