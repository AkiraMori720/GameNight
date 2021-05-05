import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,ImageBackground} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class RadioButton extends React.Component {
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
                            {this.state.radioButtonChecked &&   <View style={styles.innerTouchViewRadio}/> }
                        </TouchableOpacity>

                    <View>
                        <Text style={styles.text}>{this.props.radioTitle}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer:{

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
    }



});


