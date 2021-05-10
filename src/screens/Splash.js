import React from 'react';
import {StyleSheet, ImageBackground, SafeAreaView} from 'react-native';
import images from "../../assets/images";
import {appStart as appStartAction, ROOT_ONBOARD} from '../actions/app';
import {connect} from "react-redux";
import PropTypes from "prop-types";

class Splash extends React.Component {
    static propTypes = {
        appStart: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { appStart } = this.props;

        setTimeout(() => {
            appStart({ root: ROOT_ONBOARD });
        }, 1500);
    }


    render() {
        return(
            <SafeAreaView style={{flex:1}}>
                <ImageBackground style={styles.viewStyle} source={images.splash}>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    viewStyle: {
        flex:1
    },
});

const mapDispatchToProps = dispatch => ({
    appStart: params => dispatch(appStartAction(params))
});

export default connect(null, mapDispatchToProps)(Splash);