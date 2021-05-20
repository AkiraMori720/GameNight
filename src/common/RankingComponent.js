import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from '../../assets/images';


export default class RankingComponent extends React.Component {

    render() {
        return(
            <TouchableOpacity style={styles.mainContainer}>
                <Text style={styles.rank}>{this.props.rank}</Text>
                <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                    <View style={styles.containerLogo}>
                        {this.props.imgLeft&&<View style={styles.imgLeft}>{this.props.imgLeft}</View>}
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.score}>{this.props.score??'0'}</Text>
            </TouchableOpacity>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        flex:1,
        flexDirection: 'row',
        // marginHorizontal:wp(4),
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:"#250901",
        borderColor:'#3a0803',
        borderRadius:wp(0),
        borderBottomWidth:3,
    },
    rank: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
        paddingHorizontal:wp(3.5),
    },
    container: {
        paddingHorizontal:wp(3.5),
        flexDirection:'row',
        alignItems: 'center',
        height: hp(12),
        // borderWidth:wp(0.1),
        // marginBottom:hp(0.5),
        // paddingBottom:wp(2),
        flexGrow: 1,
    },
    containerLogo:{
        flexDirection:'row',
        alignItems: 'center',
        marginVertical:8,
    },
    imgLeft: {
        height:hp(10),
        width:wp(15),
        resizeMode:'contain',
        borderRadius: 8
        // tintColor: '#fff'
    },
    text: {
        textAlign: 'center',
        marginStart:wp(4),
        color:'#fff',
        fontSize:wp(3.5),
        fontFamily: 'Montserrat-Light',
    },
    score: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        paddingHorizontal:wp(3.5),
    },

});


