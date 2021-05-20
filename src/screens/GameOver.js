import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,ImageBackground,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import Header from '../common/Header';
import images from '../../assets/images';
import SimpleButton from '../common/SimpleButton';
import apiService from "../firebase/FirebaseHelper";


export default class GameOver extends React.Component {

    constructor(props) {
        super(props);
        this.points = props.route.params?.points??0;
        this.state = {
            showTopScore: false
        }
    }

    componentDidMount() {
        let { userid, score, maxScore } = this.props.auth;
        score += this.points;
        if(maxScore < this.points){
            maxScore = this.points;
            this.setState({ showTopScore: true });
        }

        apiService.updateProfileForUser({uid: userid}, { score, maxScore }, (res) => {

        });
    }

    render() {
        const { showTopScore } = this.state;
        return(
            <SafeAreaView style={{flex:1}}>
                <ImageBackground style={styles.mainContainer} source={images.bg}>
                    <Header onPress={() => this.props.navigation.goBack()} onPressRight={() => this.props.navigation.navigate('Setting')} bgColor={'#250901'} headerBorderWidth={2} title={'GAMENIGHT SPADEZ'} imgLeftColor={'#fff'} imgRightColor={'#EFC76C'} imgLeft={images.ic_back} s imgRight={images.ic_settings}/>
                    <View style={styles.textView}>
                        <Text style={styles.mainText}>GAME OVER!</Text>
                    </View>
                    <View style={styles.pointsView}>
                        <View style={{flexDirection: 'row',justifyContent:'space-between',width:'70%',}}>
                            <Text style={styles.text}>POINTS</Text>
                            <Text style={styles.text}>{this.points} Points</Text>
                        </View>
                        { showTopScore ? <View style={{flexDirection: 'row',justifyContent:'space-between',width:'70%',marginTop:'7%'}}>
                            <Text style={styles.text}>AWARDS</Text>
                            <Text style={styles.text}>New High Score!</Text>
                        </View> : null }
                    </View>

                    <View style={styles.btnView}>
                        <View style={{marginTop:'1%'}}>
                        <SimpleButton
                            onPress={() => this.props.navigation.navigate('Original')}
                            title={'TRY AGAIN'}/>
                        </View>
                        <View style={{marginTop:'3%'}}>
                        <SimpleButton
                            onPress={() => this.props.navigation.navigate('GameType')}
                            title={'BACK TO HOMESCREEN'}/>
                        </View>
                    </View>

                </ImageBackground>
            </SafeAreaView>



        );
    }
}

const styles= StyleSheet.create({
    mainContainer: {
        height:hp(100),
        width:wp(100),
        // backgroundColor:'#810B44',
    },
    mainText:{
        fontSize:wp(9),
        color:'#ffffff',
        textAlign: 'center',
        // fontWeight: 'bold',
        fontFamily:'Montserrat-Bold'
    },
    textView:{
        height:hp(25),
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor: 'green'
    },
    pointsView:{
        alignItems: 'center',
        height: hp(42),
        // backgroundColor:'orange'
    },
    btnView:{
        alignItems: 'center',
        height: hp(20),
        // backgroundColor:'pink'
    },
    text:{
        fontSize:wp(4.5),
        // fontWeight:'bold',
        color:'#fff',
        textAlign: 'center',
        fontFamily:'Montserrat-Regular'
    }



});


