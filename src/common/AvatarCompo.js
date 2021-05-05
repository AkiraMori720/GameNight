import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class AvatarCompo extends React.Component {

    render() {


        return(
            <SafeAreaView>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.viewAvatar}>
                        <Text>MY AVATARS</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>



        );
    }
}

const styles= StyleSheet.create({
    containerView: {

    },
    viewAvatar:{
        height:'20%',
        width:'60%',
        backgroundColor:'green',
        borderWidth: 2,
        borderColor:'#E83528',
        borderRadius: wp(7),
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:hp(0),
        bottom:hp(0),
        left:wp(0),
        right:wp(0),
    }


});


