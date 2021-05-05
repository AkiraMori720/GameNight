import React from 'react';
import {View,StyleSheet,Text,Image,ImageBackground} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate('OnBoarding');
        }, 1500);
    }


    render() {
        return(
            <ImageBackground style={styles.viewStyle} source={images.splash}>


            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex:1,
        // justifyContent:'center',
        // alignItems:'center'
    },


});
