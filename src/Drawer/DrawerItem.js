import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default class DrawerItem extends React.Component {


    render() {
        let bgColor=this.props.bgColor||"#871E2C";
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.onPress} style={[styles.containerTouchable,{backgroundColor:bgColor}]}>
                    <View style={styles.containerTouchableLogo}>
                        <Image style={styles.img} source={this.props.img}/>
                    </View>
                    <View style={styles.containerTouchableText}>
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                    <View style={styles.containerTouchableText}>
                        <Text style={styles.text}>{this.props.right}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles= StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        marginBottom:wp(3),
        // width:wp(50)
    },
    containerTouchable: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'flex-start',
        height: hp(6),
        width:wp(65),
        paddingHorizontal:wp(3),
        borderRadius:wp(0.5),


    },
    containerTouchableLogo: {
        // width:wp(10),
        // alignItems:'flex-start',
        // paddingLeft:wp(3),
    },
    containerTouchableText: {
        // width:wp(60),
        paddingLeft:wp(3)
    },
    img: {
        height:hp(4.5),
        width:wp(4.5),
        resizeMode:'contain',
        tintColor:'#fff',
    },
    text: {
        fontSize: wp(3.7),
        // fontWeight:'700',
        color: '#fff',
        textAlign:'center',
        fontFamily:'Proxima_Nova_Semibold'
    }




});


