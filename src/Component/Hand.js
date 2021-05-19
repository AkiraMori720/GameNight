import React from 'react';
import { View, Image} from "react-native";
import { PLAYER_PROPS } from "../constants/constants";

const styles = {
    handContainer: {
        height: '100%',
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
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    accessoryStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    }
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
        let accessoryStyle = styles.accessoryStyle;
        let skinStyle = styles.skinStyle;
        let nailStyle = styles.nailStyle;
        console.log('hand', nailColor);
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