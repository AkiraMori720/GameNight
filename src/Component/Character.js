import React, {useState} from 'react';
import { View, Image} from "react-native";
import images from "../../assets/images";
import {FEMALE_PROFILE_PROPS, GENDER_FEMALE, MALE_PROFILE_PROPS} from "../constants/constants";

const styles = {
    characterContainer: {
        height: '100%',
        // backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    maleSkin: {
        top: '5%',
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleSkin: {
        top: '8%',
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    hair_1: {
        position: 'absolute',
        top: '4%',
        width: '74%',
        height: '100%',
        resizeMode: 'contain'
    },
    hair_2: {
        position: 'absolute',
        top: '-27%',
        width: '52%',
        height: '100%',
        resizeMode: 'contain'
    },
    hair_3: {
        position: 'absolute',
        top: '-11%',
        width: '76%',
        height: '100%',
        resizeMode: 'contain'
    },
    eye: {
        position: 'absolute',
        top: '-4%',
        width: '28%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleHair_1: {
        position: 'absolute',
        top: '-7%',
        left: '9%',
        width: '80%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleHair_2: {
        position: 'absolute',
        top: '2%',
        width: '100%',
        height: '106%',
        resizeMode: 'contain'
    },
    femaleHair_3: {
        position: 'absolute',
        top: '-2%',
        left: '16%',
        width: '76%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleEye: {
        position: 'absolute',
        top: '-2%',
        width: '42%',
        height: '100%',
        resizeMode: 'contain'
    }
}

export default class Character extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: 100
        }
    }

    getPreviewImage = (gender, part, id) => {
        if(gender === GENDER_FEMALE){
            switch (part){
                case ('skin'):{
                    const image_key = this.props.gender + '_' + (FEMALE_PROFILE_PROPS.skins.find(i => i.id === id).image) + '_' + (this.props.shape??"1");
                    return images[image_key];
                }
                case ('hair'):{
                    const hairColorStr = this.props.hairColor?FEMALE_PROFILE_PROPS.hairColors.find(i => i.id === this.props.hairColor).image:'yellow';
                    const image_key = this.props.gender + '_hair_' + (hairColorStr) + '_' + (FEMALE_PROFILE_PROPS.hairs.find(i => i.id === id).value);
                    return images[image_key];
                }
                case ('eye'):
                    return FEMALE_PROFILE_PROPS.eyes.find(i => i.id === id).value;
            }
        } else {
            switch (part){
                case ('skin'): {
                    const image_key = this.props.gender + '_' + (MALE_PROFILE_PROPS.skins.find(i => i.id === id).image) + '_' + (this.props.shape ?? "1");
                    return images[image_key];
                }
                case ('hair'): {
                    const hairColorStr = this.props.hairColor?MALE_PROFILE_PROPS.hairColors.find(i => i.id === this.props.hairColor).image:'yellow';
                    const image_key = this.props.gender + '_hair_' + (hairColorStr) + '_' + (MALE_PROFILE_PROPS.hairs.find(i => i.id === id).value);
                    console.log('hair image', image_key);
                    return images[image_key];
                }
                case ('eye'):
                    return MALE_PROFILE_PROPS.eyes.find(i => i.id === id).value;
            }
        }

    }

    render(){
        const { width } = this.state;
        const { gender, skin, hair, eye } = this.props;
        let skinStyle = styles.maleSkin;
        let hairStyle = (hair === 1)?styles.hair_1:((hair===2)?styles.hair_2:styles.hair_3);
        let eyeStyle = styles.eye;
        if(gender===GENDER_FEMALE){
            skinStyle = styles.femaleSkin;
            hairStyle = (hair === 1)?styles.femaleHair_1:((hair===2)?styles.femaleHair_2:styles.femaleHair_3);
            eyeStyle = styles.femaleEye;
        }


        return (
            <View
                style={[styles.characterContainer, { width: width }]}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    this.setState({ width: height });
                }}
            >
                <Image style={skinStyle} source={this.getPreviewImage(gender, 'skin', skin)}/>
                <Image style={hairStyle} source={this.getPreviewImage(gender, 'hair', hair)}/>
                <Image style={eyeStyle} source={this.getPreviewImage(gender, 'eye', eye)}/>
            </View>
        );
    }
}
