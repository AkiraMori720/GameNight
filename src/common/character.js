import images from "../../assets/images";
import {GENDER_FEMALE, GENDER_MALE} from "../constants/constants";

export function getCharacterAvatar(charactor){
    if(!charactor){
        return images.male_preview_1;
    }
    const { gender, hair, eyerow, eye, nose, lip } = charactor;
    // TODO GET Character`s avatar with props
    return gender === GENDER_FEMALE?images.female_preview_1:images.male_preview_1;
}