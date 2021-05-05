import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default class NewBtn extends React.Component {


    render() {


        return(
            <SafeAreaView>
                    <TouchableOpacity  style={styles.containerTouchable}>
                        <ImageBackground
                            resizeMode={'cover'}
                            borderRadius={35}
                            style={styles.backImg} source={images.button}>
                        <Text style={styles.text}>this.props.title</Text>
                        </ImageBackground>
                    </TouchableOpacity>

            </SafeAreaView>
        );
    }
}

const styles= StyleSheet.create({

    containerTouchable: {
        alignItems: 'center',
        justifyContent:'center',
        height: hp(6),
        width:wp(80),
        backgroundColor:'green',
        borderRadius: wp(50)
        // marginStart:wp(3),
        // marginBottom:hp(2),
    },
    text:{

    },
    backImg:{
        height:'100%',
        width:'100%',
        resizeMode:'contain',
        borderRadius: wp(50),
    },

});


