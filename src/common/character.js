const Firebase_bucket_base_url = 'https://firebasestorage.googleapis.com/v0/b/game-night-9561d.appspot.com/o/';
export function getCharacterAvatar(charactor){
    if(!charactor){
        return null;
    }
    const { gender, hair, eyerow, eye, nose, lip } = charactor;
    return { uri: `${Firebase_bucket_base_url}${gender}_${hair}_${eyerow}_${eye}_${nose}_${lip}.png?alt=media`};
}