import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default class CheckBox extends React.Component {
    constructor(props){
        super(props);
        this.state={
            radioButtonChecked:false

        }

    }

    onRadioPress(){
        if (this.state.radioButtonChecked){
            this.setState({radioButtonChecked:false})
        }else{
            this.setState({radioButtonChecked:true})
        }}

    render() {
        return(
            <View style={styles.mainContainer} >
                <View style={styles.container}>

                    <TouchableOpacity onPress={()=>this.onRadioPress()} style={styles.touchViewRadio}>
                        {this.state.radioButtonChecked &&   <Image style={styles.img} source={images.ic_tick_box} />  }
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.text}>{this.props.checkTitle}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        // justifyContent: 'center',
        // alignItems:'center',
        // backgroundColor:'green',
        // flex:1,

    },
    text: {
        color:'#ffffff',
        fontFamily:'Montserrat-Bold'

    },
    container: {
        flexDirection:'row',
        alignItems: 'center',
        // backgroundColor: '#fff',
        // height:hp(10),
        // width:wp(10),
    },
    touchViewRadio: {
        height:wp(3.3),
        width:wp(3.7),
        backgroundColor: '#fff',
        // borderRadius:wp(10),
        borderWidth:wp(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:wp(2),
        borderColor:'#ffffff',
    },
    innerTouchViewRadio:{
        backgroundColor: 'red',
        width:'80%',
        height:'80%',
        borderRadius:wp(5),
        margin:1,
    },
    img:{
        resizeMode:'contain',
        height:hp(3),
        width:wp(3),
        tintColor:'red',
    }



});


