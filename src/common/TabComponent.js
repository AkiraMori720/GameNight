import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ItemDescription from "../mainFlow/ItemDescription";

export default class TabComponent extends React.Component {
    constructor(props){
        super(props);
        this.state={
            radioButtonChecked:false,
            leftBorderWidth:2.5,
            rightBorderWidth:0,
            leftTextColor:"white",
            rightTextColor:"grey"


        }

    }

    onLeftPress=()=>{
        if(this.state.rightTextColor==="white"){
            this.setState({leftTextColor:"white",rightTextColor:"grey",leftBorderWidth:2.5,rightBorderWidth:0,})
        }
        this.props.onLeftPress();
    };

    onRightPress=()=>{
        if(this.state.leftTextColor==="white"){
            this.setState({rightTextColor:"white",leftTextColor:"grey",leftBorderWidth:0,rightBorderWidth:2.5})
    }
        this.props.onRightPress();

    };

    render() {
        return(
            <View style={styles.mainContainer} >
           <View style={{flexDirection: 'row',justifyContent:"center",alignItems:"center" }}>


               <TouchableOpacity  onPress={()=>this.onLeftPress() } style={{backgroundColor:'#A9B9AA',
                   width:wp("50"),
                   height:hp(5),
                   justifyContent:"center"
                   ,alignItems:"center",
                   borderBottomWidth:this.state.leftBorderWidth,
                   borderBottomColor:"white"
               }}>
                   <Text style={{color:this.state.leftTextColor,fontSize:wp(3.7),fontFamily:'Proxima_Nova_Semibold'}} >My Purchases</Text>
               </TouchableOpacity>




                   <TouchableOpacity onPress={()=>this.onRightPress()}  style={{backgroundColor:'#A9B9AA',
                       width:wp(50)
                       ,height:hp(5),
                       justifyContent:"center",
                       alignItems:"center",
                       borderBottomWidth:this.state.rightBorderWidth,
                       borderBottomColor:"white"
                   }}>
                       <Text  style={{color:this.state.rightTextColor,fontSize:wp(3.7),fontFamily:'Proxima_Nova_Semibold'}}>Item Sold</Text>
                   </TouchableOpacity>


           </View>

            </View>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        // flex:1,
        // backgroundColor:'grey',


    },
    text: {
        color:'grey',
        fontFamily:'Proxima_Nova_Semibold'
    },
    container: {
        flexDirection:'row',
        alignItems: 'center',
        // backgroundColor: 'green'
    },
    touchViewRadio: {
        height:wp(3.3),
        width:wp(3.7),
        backgroundColor: '#fff',
        borderRadius:wp(10),
        borderWidth:wp(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:wp(2),
        borderColor:'grey'
    },
    innerTouchViewRadio:{
        backgroundColor: 'red',
        width:'80%',
        height:'80%',
        borderRadius:wp(5),
        margin:1,
    },

});


