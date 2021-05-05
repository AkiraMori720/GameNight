import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RadioButton from "./RadioButton";
import images from "../../assets/images";
export default class ModalView extends React.Component {

    render() {
        return(
            <View style={styles.mainContainer} >
                <View style={styles.modalContainer}>
                 <View style={styles.viewModalText}>
                     <Text style={styles.textTitle}>Cancel Transaction</Text>
                 </View>
                 <View style={styles.viewRadioBtn}>
                     <Text style={{width:'100%',textAlign: 'center'}}>You are about to cancel a transaction in process. if the other user agrees,funds will be returned to the buyer minus ReProposed processing fee.</Text>
                 </View>
                 <View style={styles.viewModalBtn}>
                      <TouchableOpacity style={{width:'45%',justifyContent:'center',alignItems:'center'}}>
                          <Text style={{textAlign: 'center'}}>Yes</Text>
                      </TouchableOpacity>
                     <View style={{width:'10%',justifyContent:'center',alignItems:'center'}}>
                         <View style={{height:'100%',width:'2%',backgroundColor:'#d0d0d0'}}/>
                     </View>
                     <TouchableOpacity style={{width:'45%',justifyContent:'center',alignItems:'center'}}>
                         <Text>No</Text>
                     </TouchableOpacity>
                 </View>

                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'grey',
        justifyContent:'center',
        alignItems:'center',
    },
    textTitle: {
        fontWeight:'bold',
        textAlign:'center',
        color:'#87202C',
        fontFamily:'Proxima_Nova_Semibold'
    },
    text:{
        fontSize:wp(3.2),
        fontWeight:'bold',
        fontFamily:'Proxima_Nova_Semibold'
    },
    modalContainer: {
         height:hp(27),
         width:wp(55),
        borderRadius:wp(3),
        backgroundColor: '#fff',
    },
    viewModalText:{
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(6),
        // backgroundColor:'green',
        borderTopLeftRadius: wp(3),
        borderTopRightRadius:wp(3),
    },
    viewRadioBtn:{
        height: hp(15),
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
        // justifyContent: 'space-between',
        height: hp(5.5),
        // backgroundColor:'blue',
        borderBottomLeftRadius: wp(3),
        borderBottomRightRadius:wp(3),
        borderTopWidth:wp(0.2),
        borderColor:'grey',
        // paddingHorizontal:'8%'
    },




});


