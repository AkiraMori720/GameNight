import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default class SimpleButton extends React.Component {


    render() {

        let bgColor=this.props.bgColor;
        let textColor=this.props.textColor||'#000000';
        let btnWidth=this.props.btnWidth||wp(80);
        let btnHeight=this.props.btnHeight||hp(6);
        let btnRadius=this.props.btnRadius||wp(7);
        let btnMarginStart=this.props.btnMarginStart;
        let btnMarginTop=this.props.btnMarginTop;
        let btnMarginBottom=this.props.btnMarginBottom;
        let btnMarginRight=this.props.btnMarginRight;
        let fontSize=this.props.fontSize || wp(4);
        let iconPaddingLeft=this.props.iconPaddingLeft;
        let iconPaddingRight=this.props.iconPaddingRight;


        return(
            <SafeAreaView>
            <ImageBackground
                resizeMode={'cover'}
                borderRadius={50}
                style={styles.container} source={images.button} >
                <TouchableOpacity onPress={this.props.onPress} style={[styles.containerTouchable,{backgroundColor:bgColor},{width:btnWidth},{height:btnHeight},{borderRadius:btnRadius},{paddingLeft:iconPaddingLeft},{marginStart:btnMarginStart},{marginTop:btnMarginTop},{marginBottom:btnMarginBottom},{marginRight:btnMarginRight}]}>
                    <Text style={[styles.text,{color:textColor},{fontSize:fontSize}]}>{this.props.title}</Text>
                </TouchableOpacity>
            </ImageBackground>
            </SafeAreaView>
        );
    }
}

const styles= StyleSheet.create({
    container:{
        // alignItems:'center',
        // justifyContent:'center',
    },
    containerTouchable: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'center',
        height: hp(6),
        // width:wp(100),
        // marginStart:wp(3),
        // marginBottom:hp(2),
    },

    text: {
        fontSize: wp(3.8),
        // fontWeight:'700',
        color: '#fff',
        textAlign:'center',
        fontFamily: 'Montserrat-Regular'
    }

});


