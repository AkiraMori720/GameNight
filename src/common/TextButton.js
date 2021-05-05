import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class TextButton extends React.Component {


    render() {
        let bgColor=this.props.bgColor||"#AC8B34";
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.onPress} style={[styles.containerTouchable]}>
                    <View style={styles.containerTouchableText}>
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    container:{
        height:hp(7),
        alignItems:'center',
        justifyContent:'center',
    },
    containerTouchable: {
        flexDirection:'row',
        alignItems: 'center',
        width:wp(60),
        borderRadius:wp(0.5),

    },
    containerTouchableText: {
        width:wp(60),
        // backgroundColor: "red",
        alignItems: 'center',
    },
    text: {
        fontSize: wp(3.5),
        textAlign:'center',
        // fontWeight:'700',
        color: 'gold',
        lineHeight:hp(10),
        textDecorationLine:'underline',
        fontFamily:'Montserrat-Bold'
    }




});


