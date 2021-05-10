import React from 'react';
import {View,Text,StyleSheet,Image,SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import Video from 'react-native-video';
import SimpleButton from "../common/SimpleButton";
import {connect} from "react-redux";

const introductionVideo = require('../../assets/introduction.mp4');

class Introduction extends React.Component {

    start(){
        const { characters } = this.props.auth;
        this.setState({showVideo: false});
        if(characters && characters.length > 0){
            this.props.navigation.navigate('UserProfile')
        } else {
            this.props.navigation.navigate('EditProfile')
        }
    }

    render() {
            return (
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.mainContainer}>
                        <Header
                            onPress={() => {
                                this.setState({showVideo: false});
                                this.props.navigation.navigate('UserProfile')
                            }}
                            onPressRight={() => {
                                this.setState({showVideo: false});
                                this.props.navigation.navigate('Setting')
                            }}
                            bgColor={'#460000'} title={'INTRODUCTION'} headerBorderWidth={2} imgLeft={images.ic_boy}
                            txt={'5m'} imgRight={images.ic_settings}/>

                        <View style={styles.container}>
                            <Video
                                //paused={true}
                                repeat={true}
                                controls={false}
                                shouldPlay={true}
                                source={introductionVideo}   // Can be a URL or a localfile.
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                resizeMode='stretch'
                                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                onEnd={this.onEnd}                      // Callback when playback finishes
                                onError={this.videoError}               // Callback when video cannot be loaded
                                style={styles.backgroundVideo} />
                            <View style={{position:'absolute', flexDirection :'row',justifyContent:'center', alignItems:'flex-end', top:hp(70), left:wp(20)}}>
                                <SimpleButton                        
                                    onPress={() => this.start()}
                                    btnHeight={hp(6)}
                                    btnWidth={wp(50)}                            
                                    textColor={'#000000'}
                                    fontSize={wp(5)}
                                    title={'START'}                                           
                                />
                            </View>

                        </View>
                    </View>
                </SafeAreaView>
            );
    }
}

const mapStateToProps = (state) => ({
    auth: state.login.profile,
})

export default connect(mapStateToProps, null)(Introduction)

const styles= StyleSheet.create({
    mainContainer: {
        height:hp(100),
        width:wp(100),
        backgroundColor:'#881000',
    },
    container:{
        justifyContent:'center',
        height:hp(80),
        backgroundColor: '#691201',
        margin:'5%',
    },
    backgroundVideo: {
        height: '100%',
        width: '100%',
    },
});


