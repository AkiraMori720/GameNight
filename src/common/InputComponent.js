import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class InputComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            secureTextEntry: false
        }
    }

    componentWillMount() {
        const { secureTextEntry } = this.props
        this.setState({
            secureTextEntry
        })
    }

    render() {
        let bgColor=this.props.bgColor || '#ffffff';
        let textColor=this.props.textColor || '#ffffff';
        let placeholderTextColor = this.props.placeholderTextColor || '#aaaaaa';
        let inputHeight=this.props.inputHeight || hp(5);
        let inputWidth=this.props.inputWidth || wp(92);
        let inputRadius=this.props.inputRadius || wp(2);
        let inputPaddingLeft=this.props.inputPaddingLeft;
        let iconHeight=this.props.iconHeight || hp(5);
        let iconWidth=this.props.iconWidth || wp(5);
        let iconWidthRight=this.props.iconWidthRight || wp(4.5);
        let iconHeightRight=this.props.iconHeightRight || hp(4.5);
        let secureTextEntry = this.state.secureTextEntry;
        return(


            <View style={[styles.containerView,{backgroundColor: bgColor ,width:inputWidth, height:inputHeight,borderRadius: inputRadius}]}>
                <Image style={[styles.img,{height:iconHeight},{width: iconWidth}]} source={this.props.imgLeft} />
                <TextInput
                    secureTextEntry={secureTextEntry}
                    style={[styles.textInput,{paddingLeft:inputPaddingLeft}, {color : textColor}]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    autoCapitalize={this.props.autoCapitalize??'sentences'}
                />
                <TouchableOpacity onPress={() => {
                    if (this.props.secureTextEntry) {
                        this.setState({secureTextEntry: !secureTextEntry})
                    }
                }}>
                    <Image style={[styles.img,{height:iconHeightRight},{width: iconWidthRight}]} source={this.props.imgRight} />
                </TouchableOpacity>

            </View>



        );
    }
}

const styles= StyleSheet.create({
    containerView: {
        backgroundColor:"#fff",
        paddingRight:wp(4),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: hp(5),
        width:wp(92),
        borderRadius:wp(2)
        // borderBottomWidth:2,
        // borderColor:'red',
        // borderWidth:wp(0.1),
        // paddingBottom:wp(2)
    },
    textInput: {
        flex:1,
        // paddingLeft:wp(2),
    },
    img: {
        height:hp(5),
        width:wp(5),
        resizeMode:'contain',
        // tintColor:'#000000',
    },
    text: {
        fontSize: wp(4),
        // fontWeight:'700',
        color: '#fff',
        textAlign:'center',
        // fontFamily:'Proxima_Nova_Semibold'
    }




});


