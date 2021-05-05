import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from '../../assets/images';

export default class Header extends React.Component {

    render() {
        let bgColor=this.props.bgColor;
        let textColor=this.props.textColor||"#ffffff";
        let imgLeftColor=this.props.imgLeftColor;
        let imgRightColor=this.props.imgRightColor;
        let headerHeight=this.props.headerHeight || hp(7.5);
        let headerBorderWidth=this.props.headerBorderWidth;


        return(
                <SafeAreaView>
                <View style={[styles.containerView,{backgroundColor:bgColor},{height:headerHeight,borderBottomWidth:headerBorderWidth }]}>

                    <TouchableOpacity onPress={this.props.onPress} style={styles.imgLeft}>
                        <Image style={[styles.img,{tintColor:imgLeftColor}]} source={this.props.imgLeft}/>
                    </TouchableOpacity>

                    <View style={[styles.imgMiddle]}>
                        <Text style={[styles.text,{color:textColor}]}>{this.props.title}</Text>
                    </View>

                    <TouchableOpacity  onPress={this.props.onPressRight} style={styles.imgRight}>
                        <View style={{height:'100%',width:'40%'}}>
                        <Text style={{color:'#ffffff'}}>{this.props.txt}</Text>
                        </View>
                        <View style={{height:'100%',width:'60%'}}>
                        <Image style={[styles.img,{tintColor:imgRightColor}]} source={this.props.imgRight}/>
                        </View>
                    </TouchableOpacity>

                </View>
                </SafeAreaView>



        );
    }
}

const styles= StyleSheet.create({
    containerView: {
        width:wp(100),
        // backgroundColor:"pink",
        // paddingHorizontal:wp(3),
        flexDirection:'row',
        alignItems: 'center',
        // justifyContent:'space-between',
        height: hp(7),
        borderBottomWidth:2,
        borderColor:'#E83528'
    },
    img: {
        height:hp(6),
        width:wp(6),
        resizeMode:'contain',
    },
    text: {
        fontSize: wp(4),
        // fontWeight:'700',
        textAlign:'center',
        fontFamily: 'Montserrat-Light'
    },
    imgLeft: {
        width:'15%',
        // alignItems:'flex-start',
        // paddingLeft:wp(3),
        // backgroundColor:'pink',
        // marginLeft:wp(0)
        paddingLeft:wp(3)
    },
    imgMiddle: {
        alignItems:'flex-start',
        width:'70%',
        // backgroundColor:'green',

    },
    imgRight: {
        // height:'100%',
        width:'15%',
        // backgroundColor:'orange',
        flexDirection: 'row',
        alignItems: 'center',
    },

});


