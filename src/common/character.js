import images from "../../assets/images";
import {GENDER_FEMALE, GENDER_MALE} from "../constants/constants";

const Firebase_bucket_base_url = 'https://firebasestorage.googleapis.com/v0/b/game-night-9561d.appspot.com/o/';
export function getCharacterAvatar(charactor){
    if(!charactor){
        return images.male_preview_1;
    }
    const { gender, hair, eyerow, eye, nose, lip } = charactor;
    // TODO GET Character`s avatar with props
    //return gender === GENDER_FEMALE?images.female_preview_1:images.male_preview_1;
    return { uri: `${Firebase_bucket_base_url}${gender}_${hair}_${eyerow}_${eye}_${nose}_${lip}.png?alt=media`};
}