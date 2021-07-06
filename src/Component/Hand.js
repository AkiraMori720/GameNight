import React from 'react';
import { View, Image} from "react-native";
import { PLAYER_PROPS } from "../constants/constants";

const styles = {
    handContainer: {
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    skinStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    nailStyle: {
        position: 'absolute',
        width: '9%',
        height: '9%',
        top: '1.5%',
        right: '37%',
        resizeMode: 'contain'
    },
    accessoryStyle_1: {
        position: 'absolute',
        width: '30%',
        height: '30%',
        bottom: '6%',
        right: '36%',
        resizeMode: 'contain'
    },
    accessoryStyle_2: {
        position: 'absolute',
        width: '32%',
        height: '32%',
        bottom: '4%',
        right: '36%',
        resizeMode: 'contain'
    },
    accessoryStyle_3: {
        position: 'absolute',
        width: '14%',
        height: '14%',
        top: '12%',
        right: '48%',
        resizeMode: 'contain'
    },
}

export default class Hand extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: 100
        }
    }

    getPreviewImage = (part, id) => {
        switch (part){
            case ('skin'):
                return PLAYER_PROPS.skinColors.find(i => i.id === id).image;
            case ('nail'):
                return PLAYER_PROPS.nailColors.find(i => i.id === id).image;
            case ('accessory'):
                return PLAYER_PROPS.accessories.find(i => i.id === id).image;
        }
        return null;
    }

    render(){
        const { width } = this.state;
        const { skinColor, nailColor, accessory } = this.props;
        let accessoryStyle = accessory==='bracelet'?styles.accessoryStyle_1:(accessory==='watch'?styles.accessoryStyle_2:styles.accessoryStyle_3);
        let skinStyle = styles.skinStyle;
        let nailStyle = styles.nailStyle;

        return (
            <View
                style={[styles.handContainer, { width: width }]}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    this.setState({ width: height });
                }}
            >
                <Image style={skinStyle} source={this.getPreviewImage('skin', skinColor)}/>
                <Image style={accessoryStyle} source={this.getPreviewImage('accessory', accessory)}/>
                <Image style={nailStyle} source={this.getPreviewImage('nail', nailColor)}/>
            </View>
        );
    }
}
