import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import Header from '../common/Header';
import images from '../../assets/images';
import SimpleButton from '../common/SimpleButton';
import { connect } from 'react-redux'
import {
    setPreferences as setPreferencesAction,
} from '../actions/preference'
import {appStart as appStartAction, ROOT_ONBOARD} from "../actions/app";

class GameType extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            gameTypes : [
                {
                    typeId: 'solo',
                    name: 'Solo Play',
                },
                {
                    typeId: 'partner',
                    name: 'Partner Play',
                },
                {
                    typeId: 'random',
                    name: 'Random Play',
                },
            ],
            selected_type_id: 0
        }
    }

    componentDidMount() {
        const { gameType } = this.props.preference
        if (gameType) {
            const { gameTypes } = this.state
                gameTypes.forEach((type, idx) => {
                    if (type.typeId === gameType) {
                        this.setState({
                            selected_type_id: idx,
                        })
                    }
                })
        }
    }

    selectGameType = (typeId) => {
        const { gameTypes } = this.state;
        const { setPreferences } = this.props;
        const { userid } = this.props.auth

        let selected_type_id = 0
        gameTypes.forEach((t, idx) => {
            if (t.typeId === typeId) {
                selected_type_id = idx
            }
        });

        const preferences = { gameType: this.state.gameTypes[selected_type_id].typeId }

        setPreferences({userId: userid, preferences});

        this.setState({
                selected_type_id,
                collapsed: false
            });
    }

    renderGameTypeLists = () => {
        const { gameTypes } = this.state

        return (
            <View style={styles.collapseBodyView}>
                {
                    gameTypes.map(type => {
                        const typeId = type.typeId
                        const name = type.name
                        return (
                            <TouchableOpacity style={{ paddingVertical: hp(1) }} key={typeId} onPress={() => this.selectGameType(typeId)}>
                                <Text style={styles.collapseBodyText}>{name}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    onGameStyleButtonClicked = () => {
        const selected_type_id = this.state.selected_type_id
        const selected_game_type = this.state.gameTypes[selected_type_id].typeId
        const { userid } = this.props.auth
        this.props.setPreferences({userId: userid, preferences: {gameType: selected_game_type, privateMatch: false}});
        this.props.navigation.navigate('GameStyle');
    }

    onPrivateMatchButtonClicked = () => {
        const selected_type_id = this.state.selected_type_id
        const selected_game_type = this.state.gameTypes[selected_type_id]
        const { setPreferences } = this.props;
        const { userid } = this.props.auth
        setPreferences({userId: userid, preferences: {gameType: selected_game_type, privateMatch: true}});
        this.props.navigation.navigate('GameStyle');
    }

    onGotoBoard = () => {
        this.props.navigation.navigate('LeaderBoard');
    }

    render() {
        const selected_type_id = this.state.selected_type_id
        const selected_game_type = this.state.gameTypes[selected_type_id]
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.mainContainer}>
                    <Header
                        onPress={() => this.props.navigation.navigate('UserProfile')} onPressRight={() => this.props.navigation.navigate('Setting')}
                        bgColor={'#460000'} title={'GAMENIGHT SPADEZ'} headerBorderWidth={2}  imgLeft={images.ic_boy}  imgRight={images.ic_settings}/>
                    <View style={styles.textView}>
                        <Text style={styles.text}>SELECT GAME TYPE</Text>
                    </View>
                    <View style={styles.optionView}>
                        <Collapse
                            isCollapsed = {this.state.collapsed}
                            onToggle = {isCollapsed => this.setState({ collapsed: isCollapsed })}
                        >
                            <CollapseHeader>
                                <View style={styles.collapseHeaderView}>
                                    <Text style={styles.text}>{selected_game_type.name}</Text>
                                    <Image style={styles.img} source={images.ic_dropdow}/>
                                </View>
                            </CollapseHeader>
                            <CollapseBody>
                                { this.renderGameTypeLists() }
                            </CollapseBody>
                        </Collapse>
                    </View>
                    <View style={styles.btnView}>
                        <View>
                        <SimpleButton
                            onPress={this.onGameStyleButtonClicked}
                             title={'GAME STYLES'}/>
                        </View>
                        <View style={{marginTop:'2.5%'}}>
                        <SimpleButton
                            onPress={this.onGotoBoard}
                            title={'LEADERBOARDS'}/>
                        </View>
                        <View style={{marginTop:'2.5%'}}>
                            <SimpleButton
                                onPress={() => this.props.navigation.navigate('UserProfile')}
                                title={'MY AVATAR'}/>
                        </View>
                        <View style={{marginTop:'2.5%'}}>
                            <SimpleButton
                                onPress={this.onPrivateMatchButtonClicked}
                                title={'PRIVATE MATCH'}/>
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
        fontSize:wp(4.5),
        color:'#fff',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    textView:{
        height:hp(10),
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor: 'green'
    },
    btnView:{
        alignItems: 'center',
        height: hp(50),
        // backgroundColor:'pink'
    },
    optionView:{
        height:hp(40),
        alignItems:'center',
    },
    img:{
        resizeMode: 'contain',
        height:hp(5),
        width: wp(3),
        tintColor: '#fff',
    },
    collapseHeaderView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor: '#460000',
        width:wp(80),
        borderRadius:wp(6),
        paddingHorizontal:wp(6),
    },
    collapseBodyView:{
        // justifyContent:'center',
        backgroundColor:'#460000',
        paddingLeft:'7%',
        paddingTop:'0%',
        marginTop: '2%'
    },
    collapseBodyText:{
        color:'#fff',
        // fontSize: wp(3.8),
        fontSize:wp(4.5),
        fontFamily: 'Montserrat-Regular',
    }
});

const mapDispatchToProps = (dispatch) => ({
    appStart: params => dispatch(appStartAction(params)),
    setPreferences: (params) => dispatch(setPreferencesAction(params)),
    dispatch
})

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.login.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(GameType)
