import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Modal} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";
import colors from "../../assets/colors";

export default class Modal2 extends React.Component {



    render() {

        return(
            <View style={styles.mainContainer}>

                    <View style={styles.modalContainer}>
                        <View style={styles.viewModalText}>
                            <Text style={styles.textTitle}>Rate the Seller</Text>
                        </View>
                        <View style={styles.viewRadioBtn}>
                            <Image style={styles.image} source={images.ic_avatar_boy}/>
                            <Text style={{textAlign: 'center',color:'#871E2C',fontSize:wp(4.5),paddingTop: '4%',fontFamily:'lexi_bold'}}>Clover Williams</Text>
                            <View style={{flexDirection: 'row',alignItems:'center',marginTop:'4%'}}>
                                <Image style={{height:25,width:32}} source={images.ic_star2} />
                                <Image style={{height:25,width:32}} source={images.ic_star2} />
                                <Image style={{height:25,width:32}} source={images.ic_star2} />
                                <View style={{marginLeft:'2%'}}>
                                    <Image style={{height:22,width:20}} source={images.ic_star3} />
                                </View>
                                <View style={{marginLeft:'4%'}}>
                                    <Image style={{height:22,width:20}} source={images.ic_star3} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewModalBtn}>
                            <TouchableOpacity style={{width:'45%',justifyContent:'center',alignItems:'center'}} onPress={()=>this.accept()}>
                                <Text style={{textAlign: 'center',color:'#871E2C',fontSize:wp(4.4),fontWeight: 'bold'}}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        flex:1,
        backgroundColor: '#F0F0F0',
    },
    image:{
        resizeMode:'contain',
        height:hp(15),
        width:wp(25),
    },
    textTitle: {
        fontWeight:'bold',
        textAlign:'center',
        color:'#871E2C',
        fontSize:wp(4.4),
        fontFamily:'Proxima_Nova_Semibold'
    },
    modalContainer: {
        height:hp(45),
        width:wp(70),
        borderRadius:wp(3),
        backgroundColor: '#fff',
    },
    viewModalText:{
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(8),
        // backgroundColor:'green',
        borderTopLeftRadius: wp(3),
        borderTopRightRadius:wp(3),
    },
    viewRadioBtn:{
        height: hp(29),
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
        justifyContent: 'center',
        height:'18%',
        // backgroundColor:'blue',
        borderBottomLeftRadius: wp(3),
        borderBottomRightRadius:wp(3),
        borderTopWidth:wp(0.2),
        borderColor:'grey',
        // paddingHorizontal:'8%'
    },




});


