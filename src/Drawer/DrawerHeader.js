import React, { Component } from "react";
import {   View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";


export default class DrawerHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerProps: this.props.nav,
        };
    }

    render() {
        let bgColor=this.props.bgColor||"#A9B9AA";
        let textColor=this.props.textColor||"#A9B9AA";
        let imgLeftColor=this.props.imgLeftColor||"#A9B9AA";
        let imgRightColor=this.props.imgRightColor||"#A9B9AA";
        let iconWidthRight=this.props.iconWidthRight || wp(5);
        let iconHeightRight=this.props.iconHeightRight || hp(3);
        const nav = this.state.drawerProps;
        return (

                <View style={[styles.mainView,{backgroundColor:bgColor}]} >
                    <SafeAreaView style={styles.container}>
                        <View style={[styles.headerLeftIcon,{tintColor:imgLeftColor}]}>
                            <TouchableOpacity onPress={() => nav.openDrawer()}>
                                <Image style={styles.imgLeft} source={this.props.imgLeft} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.viewText,{color:textColor}]}>
                            <Text style={styles.text}>
                                {this.props.title}
                            </Text>
                        </View>
                        <View style={[styles.rightIcon,{tintColor:imgRightColor}]}>
                            <TouchableOpacity onPress={this.props.onPress}>
                                <Image style={[styles.imgRight,{height:iconHeightRight},{width:iconWidthRight}]} source={this.props.imgRight} />
                            </TouchableOpacity>
                        </View>

                    </SafeAreaView>
                </View>

        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        height: hp(8),
        backgroundColor:'green',
        width:wp(100),
        justifyContent: 'center',
        alignItems:'center',
    },
    container: {
        flexDirection: "row",
    },
    headerLeftIcon: {
        alignItems:'flex-start',
        justifyContent:'center',
        width:wp(32.5),
    },
    viewText:{
        width:wp(32.5),
        alignItems:'center',
        justifyContent:'center',
    },
    text: {
        color:'#fff',
        fontSize:wp(5),
        fontFamily:'Proxima_Nova_Semibold'
    },
    imgLeft:{
        height:hp(4),
        width:wp(7),
        tintColor:'#fff',
    },
    imgRight:{
        height:hp(3),
        width:wp(5),
        tintColor:'#fff',
    },
    rightIcon: {
        width:wp(32.5),
        alignItems:'flex-end',
        justifyContent:'center',
        // backgroundColor: 'green',
        paddingRight:wp(1),
    }


});
