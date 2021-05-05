import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { connect } from 'react-redux';
import {
    setPreferences,
} from '../actions/preference';


class GamePreferences extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            gameType: 'solo',
            soloPoints: 70,
            partnerPoints: 100,
        }
    }

    componentDidMount() {
        console.log('componentdidmount')
        const { gameType, soloPoints, partnerPoints } = this.props.preference
        this.setState({
            gameType,
            soloPoints,
            partnerPoints
        })
    }

    _onPressType(gameType) {
        const preferences = { gameType }
        const { userid } = this.props.auth
        
        this.props.setPreferences(userid, preferences)
            .then(() => {
                this.setState({
                    gameType
                })
            })
    }

    _onPressSolo(soloPoints) {
        const preferences = { soloPoints }
        const { userid } = this.props.auth
        
        this.props.setPreferences(userid, preferences)
            .then(() => {
                this.setState({
                    soloPoints
                })
            })
    }

    _onPressPartner(partnerPoints) {
        const preferences = { partnerPoints }
        const { userid } = this.props.auth
        
        this.props.setPreferences(userid, preferences)
            .then(() => {
                this.setState({
                    partnerPoints
                })
            })
    }

    calculateBgColors () {
        let bgColors = []
        if (this.state.gameType == 'solo') {
            bgColors[0] = 'red'
            bgColors[1] = '#460000'
        } else {
            bgColors[0] = '#460000'
            bgColors[1] = 'red'
        }

        switch (this.state.soloPoints) {
            case 70:
                bgColors[2] = 'red'
                bgColors[3] = '#460000'
                bgColors[4] = '#460000'
                break;
            case 100:
                bgColors[2] = '#460000'
                bgColors[3] = 'red'
                bgColors[4] = '#460000'
                break;
            case 130:
                bgColors[2] = '#460000'
                bgColors[3] = '#460000'
                bgColors[4] = 'red'
                break;
            default:
                bgColors[2] = 'red'
                bgColors[3] = '#460000'
                bgColors[4] = '#460000'
                break;
        }

        switch (this.state.partnerPoints) {
            case 100:
                bgColors[5] = 'red'
                bgColors[6] = '#460000'
                bgColors[7] = '#460000'
                break;
            case 200:
                bgColors[5] = '#460000'
                bgColors[6] = 'red'
                bgColors[7] = '#460000'
                break;
            case 250:
                bgColors[5] = '#460000'
                bgColors[6] = '#460000'
                bgColors[7] = 'red'
                break;
            default:
                bgColors[5] = 'red'
                bgColors[6] = '#460000'
                bgColors[7] = '#460000'
                break;
        }

        return bgColors
    }

    render() {
        let bgColors = this.calculateBgColors();
        console.log(this.props.preference)
        
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer}>
                    <Header onPress={() => this.props.navigation.pop()} bgColor={'#250901'} headerBorderWidth={2}   imgLeft={images.ic_back} title={'GAMENIGHT SPADEZ'} />
                    <View style={styles.textView}>
                        <Text style={styles.text}>PICK GAME TYPE</Text>
                    </View>
                    <View style={styles.typeView}>
                    <View style={styles.typeInnerView}>
                        <TouchableOpacity
                            onPress={() => this._onPressType('solo')}
                            style={[styles.typeViewBtnLeft,{backgroundColor:bgColors[0]}]}
                        >
                            <Text style={styles.textBtn}>Solo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this._onPressType('partner')}
                            style={[styles.typeViewBtnRight,{backgroundColor:bgColors[1]}]}
                        >
                            <Text style={styles.textBtn}>Partner</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.text}>SELECT POINTS TO WIN SOLO GAME</Text>
                    </View>
                    <View style={styles.typeView}>
                        <View style={styles.typeInnerView}>
                            <TouchableOpacity onPress={() => this._onPressSolo(70)}  style={[styles.typeViewBtnLeft,{width:'33.3%',backgroundColor:bgColors[2]}]}><Text style={styles.textBtn}>70</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this._onPressSolo(100)}  style={[styles.typeViewBtnMiddle,{width:'33.3%',backgroundColor:bgColors[3]}]}><Text style={styles.textBtn}>100</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this._onPressSolo(130)} style={[styles.typeViewBtnRight,{width:'33.3%',backgroundColor:bgColors[4]}]}><Text style={styles.textBtn}>130</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.text}>SELECT POINTS FOR PARTNER (RENIG)</Text>
                    </View>
                    <View style={styles.typeView}>
                        <View style={styles.typeInnerView}>
                            <TouchableOpacity onPress={() => this._onPressPartner(100)} style={[styles.typeViewBtnLeft,{width:'33.3%',backgroundColor:bgColors[5]}]}><Text style={styles.textBtn}>100</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this._onPressPartner(200)} style={[styles.typeViewBtnMiddle,{width:'33.3%',backgroundColor:bgColors[6]}]}><Text style={styles.textBtn}>200</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this._onPressPartner(250)} style={[styles.typeViewBtnRight,{width:'33.3%',backgroundColor:bgColors[7]}]}><Text style={styles.textBtn}>250</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        height:hp(100),
        width:wp(100),
        backgroundColor:'#881000',
    },
    text:{
        fontSize:wp(3.6),
        // fontWeight:'bold',
        color:'#fff',
        textAlign: 'center',
        paddingTop:'5%',
        fontFamily:'Montserrat-Regular'
    },
    textView:{
        height:hp(10),
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor: 'green'
    },
    typeView:{
        alignItems:'center'
    },
    typeInnerView:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:hp(7),
        width: wp(80),
        // backgroundColor: 'green',
        borderTopLeftRadius:wp(7),
        borderBottomLeftRadius:wp(7),
        borderTopRightRadius:wp(7),
        borderBottomRightRadius:wp(7)
    },
    typeViewBtnLeft:{
        backgroundColor:'red',
        height:'100%',
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
        borderTopLeftRadius:wp(7),
        borderBottomLeftRadius:wp(7),
    },
    typeViewBtnRight:{
        backgroundColor:'#460000',
        height:'100%',
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius:wp(7),
        borderBottomRightRadius:wp(7)
    },
    typeViewBtnMiddle:{
        backgroundColor:'#460000',
        height:'100%',
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
    },
    textBtn:{
        color:'#fff',
        fontSize: wp(3.6),
        fontFamily:'Montserrat-Bold'
    }

});

const mapDispatchToProps = (dispatch) => ({
    setPreferences: (userid, preferences) => dispatch(setPreferences(userid, preferences)),
    dispatch
})

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(GamePreferences)
