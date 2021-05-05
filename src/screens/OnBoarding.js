import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import images from "../../assets/images";
import SimpleButton from "../common/SimpleButton";

export default class OnBoarding extends Component {

    constructor(props) {
        super(props);
    }


    continue(){
        this.props.navigation.navigate('SignWith');
    }

    render() {

        return (
            <View style={{ flex:1}}>
                <ImageBackground source={images.onboard} style={styles.backgroundImage}>
                    <View style={{flexDirection :'row',justifyContent:'center', alignItems:'flex-end', top:hp(85)}}>
                        <SimpleButton                        
                            onPress={() => this.continue()}
                            btnHeight={hp(6)}
                            btnWidth={wp(70)}                            
                            textColor={'#000000'}
                            fontSize={wp(5)}
                            title={'CONTINUE'}                                           
                        />
                    </View>
                </ImageBackground>    
            </View>

        );


    }
}
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', // or 'stretch'
    },
});
