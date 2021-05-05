import React, { Component } from "react";
import { Text, View, ImageBackground, Image,StyleSheet,TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from "../../assets/images";

export default  class SideMenuHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.mainView}>

                    <View style={styles.viewStyle}>
                        <TouchableOpacity style={styles.touchableIcon} onPress={this.props.onPress}>
                            <Image style = {styles.icon}
                                source={images.ic_avatar_boy}
                            />
                        </TouchableOpacity>
                            <Text style={styles.text}>
                                Hi. John
                            </Text>
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create ({
    mainView: {
        height:hp(35),
        // justifyContent:'center',
        // alignItems:'center',
        width:wp(75),
        // backgroundColor:'green'
    },
    icon: {
        height: hp(15),
        width:wp(20),
        resizeMode: 'contain',
        paddingTop:hp(7),
        // backgroundColor:"green"

    },
    viewStyle: {
        alignItems: "center",
        justifyContent:'center',
        paddingTop: hp(11),
    },

    text: {
        color: '#871E2C',
        fontSize:wp(4.5),
        // fontWeight:'bold',
        fontFamily:'lexi_bold',
    },
    viewArrow: {
        marginRight:wp(2)
    },
    touchableIcon: {
        alignItems: "center",
        justifyContent:'center',
    }
});

