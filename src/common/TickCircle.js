import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";
export default class TickCircle extends React.Component {


    render() {
        let bgColor=this.props.bgColor||"#AC8B34";
        return(
            <View style={styles.container}>
                <View style={styles.containerImg}>
                    <Image style={styles.img} source={this.props.img}/>
                </View>
                    <View style={styles.containerText}>
                        <Text style={styles.text} numberOfLines={2}>{this.props.title}</Text>
                    </View>

            </View>
        );
    }
}

const styles= StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        // justifyContent:'center',
        // marginStart: wp(2),
        marginRight:wp(13)
    },
    containerImg: {
        // alignItems: 'center',
        // width:wp(60),
        // borderRadius:wp(0.5),

    },
    containerText: {
        marginLeft:wp(2)
        // width:wp(60),
        // // backgroundColor: "red",
        // alignItems: 'center',
    },
    text: {

        fontSize: wp(3.4),
        color: '#FFFFFF',
        fontFamily:'Montserrat-Bold'

    },
    img: {
        height:hp(3.8),
        width:wp(3.8),
        resizeMode:'contain',
    }

});


