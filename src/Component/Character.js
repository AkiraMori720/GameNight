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
        width: '88%',
        height: '88%',
        resizeMode: 'contain'
    },
    femaleSkin: {
        top: '8%',
        width: '90%',
        height: '90%',
        resizeMode: 'contain'
    },
    hair_1: {
        position: 'absolute',
        top: '-30%',
        width: '54%',
        height: '100%',
        resizeMode: 'contain'
    },
    hair_2: {
        position: 'absolute',
        top: '-26%',
        width: '56%',
        height: '100%',
        resizeMode: 'contain'
    },
    hair_3: {
        position: 'absolute',
        top: '-31%',
        width: '50%',
        height: '100%',
        resizeMode: 'contain'
    },
    eyerow: {
        position: 'absolute',
        top: '-17%',
        width: '44%',
        height: '100%',
        resizeMode: 'contain'
    },
    eye: {
        position: 'absolute',
        top: '-9%',
        width: '40%',
        height: '100%',
        resizeMode: 'contain'
    },
    nose_1: {
        position: 'absolute',
        top: '6%',
        width: '18%',
        height: '100%',
        resizeMode: 'contain'
    },
    nose_2: {
        position: 'absolute',
        top: '6%',
        width: '14%',
        height: '100%',
        resizeMode: 'contain'
    },
    nose_3: {
        position: 'absolute',
        top: '6%',
        width: '16%',
        height: '100%',
        resizeMode: 'contain'
    },
    lip: {
        position: 'absolute',
        top: '16%',
        width: '26%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleHair_1: {
        position: 'absolute',
        top: '-7%',
        width: '78%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleHair_2: {
        position: 'absolute',
        top: '-7%',
        width: '78%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleHair_3: {
        position: 'absolute',
        top: '-7%',
        width: '78%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleEyerow: {
        position: 'absolute',
        top: '-11%',
        width: '48%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleEye: {
        position: 'absolute',
        top: '-2%',
        width: '42%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleNose_1: {
        position: 'absolute',
        top: '10%',
        width: '18%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleNose_2: {
        position: 'absolute',
        top: '10%',
        width: '14%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleNose_3: {
        position: 'absolute',
        top: '10%',
        width: '16%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleLip_1: {
        position: 'absolute',
        top: '21%',
        width: '24%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleLip_2: {
        position: 'absolute',
        top: '21%',
        width: '22%',
        height: '100%',
        resizeMode: 'contain'
    },
    femaleLip_3: {
        position: 'absolute',
        top: '22%',
        width: '18%',
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
                case ('skin'):
                    const image_key = this.props.gender + '_' + (FEMALE_PROFILE_PROPS.skins.find(i => i.id === id).image) + '_' + (this.props.shape??"1");
                    return images[image_key];
                case ('hair'):
                    return FEMALE_PROFILE_PROPS.hairs.find(i => i.id === id).value;
                case ('eyerow'):
                    return FEMALE_PROFILE_PROPS.eyerows.find(i => i.id === id).value;
                case ('eye'):
                    return FEMALE_PROFILE_PROPS.eyes.find(i => i.id === id).value;
                case ('nose'):
                    return FEMALE_PROFILE_PROPS.noses.find(i => i.id === id).value;
                case ('lip'):
                    return FEMALE_PROFILE_PROPS.lips.find(i => i.id === id).value;
            }
        } else {
            switch (part){
                case ('skin'):
                    const image_key = this.props.gender + '_' + (FEMALE_PROFILE_PROPS.skins.find(i => i.id === id).image) + '_' + (this.props.shape??"1");
                    return images[image_key];
                case ('hair'):
                    return MALE_PROFILE_PROPS.hairs.find(i => i.id === id).value;
                case ('eyerow'):
                    return MALE_PROFILE_PROPS.eyerows.find(i => i.id === id).value;
                case ('eye'):
                    return MALE_PROFILE_PROPS.eyes.find(i => i.id === id).value;
                case ('nose'):
                    return MALE_PROFILE_PROPS.noses.find(i => i.id === id).value;
                case ('lip'):
                    return MALE_PROFILE_PROPS.lips.find(i => i.id === id).value;
            }
        }

    }

    render(){
        const { width } = this.state;
        const { gender, skin, hair, eyerow, eye, nose, lip } = this.props;
        let skinStyle = styles.maleSkin;
        let hairStyle = (hair === 1)?styles.hair_1:((hair===2)?styles.hair_2:styles.hair_3);
        let eyerowStyle = styles.eyerow;
        let eyeStyle = styles.eye;
        let noseStyle = (nose === 1)?styles.nose_1:((nose===2)?styles.nose_2:styles.nose_3);
        let lipStyle = styles.lip;
        if(gender===GENDER_FEMALE){
            skinStyle = styles.femaleSkin;
            hairStyle = (hair === 1)?styles.femaleHair_1:((hair===2)?styles.femaleHair_2:styles.femaleHair_3);
            eyerowStyle = styles.femaleEyerow;
            eyeStyle = styles.femaleEye;
            noseStyle = (nose === 1)?styles.femaleNose_1:((nose===2)?styles.femaleNose_2:styles.femaleNose_3);
            lipStyle = (lip === 1)?styles.femaleLip_1:((lip===2)?styles.femaleLip_2:styles.femaleLip_3);
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
                <Image style={eyerowStyle} source={this.getPreviewImage(gender, 'eyerow', eyerow)}/>
                <Image style={eyeStyle} source={this.getPreviewImage(gender, 'eye', eye)}/>
                <Image style={hairStyle} source={this.getPreviewImage(gender, 'hair', hair)}/>
                <Image style={noseStyle} source={this.getPreviewImage(gender, 'nose', nose)}/>
                <Image style={lipStyle} source={this.getPreviewImage(gender, 'lip', lip)}/>
            </View>
        );
    }
}
