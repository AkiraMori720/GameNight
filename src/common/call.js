import { Linking, Platform } from 'react-native';

const FACEBOOK_APP_URL = 'whatsapp://send';
const FACEBOOK_MESSENGER_PLAY_STORE_ID = 'com.whatsapp';

const FACETIME_APP_URL = 'facetime://gamenight';
const FACETIME_APP_STORE_URL = 'itms-apps://itunes.apple.com/us/app/facetime/id1110145091?mt=8';
const FACETIME_ITUNES_URL = 'https://itunes.apple.com/us/app/facetime/id1110145091?mt=8'

export const openCallApp = async () => {
    let appLink = '';
    if (Platform.OS === 'ios') {
        appLink = FACETIME_APP_URL;
    } else {
        appLink = FACEBOOK_APP_URL;
    }
    Linking.openURL(appLink).catch(err => {
        console.log('supported', err);
        if (err.code === 'EUNSPECIFIED') {
            if (Platform.OS === 'ios') {
                Linking.canOpenURL(FACETIME_APP_STORE_URL)
                    .then(supported => {
                        if(supported){
                            Linking.openURL(FACETIME_APP_STORE_URL);
                        } else {
                            Linking.openURL(FACETIME_ITUNES_URL);
                        }
                    })
                    .catch(e => console.log(e))
            } else {
                Linking.openURL(
                    `https://play.google.com/store/apps/details?id=${FACEBOOK_MESSENGER_PLAY_STORE_ID}&hl=en_US&gl=US`
                );
            }
        } else {
            throw new Error(`Could not open Call App. ${err.toString()}`);
        }
    });
};

export const maybeOpenURL = async (
    url,
    { appName, appStoreId, appStoreLocale, playStoreId }
) => {
    Linking.openURL(url).catch(err => {
        if (err.code === 'EUNSPECIFIED') {
            if (Platform.OS === 'ios') {
                // check if appStoreLocale is set
                const locale = typeof appStoreLocale === 'undefined'
                    ? 'us'
                    : appStoreLocale;

                Linking.openURL(`https://apps.apple.com/${locale}/app/${appName}/id${appStoreId}`);
            } else {
                Linking.openURL(
                    `https://play.google.com/store/apps/details?id=${playStoreId}`
                );
            }
        } else {
            throw new Error(`Could not open ${appName}. ${err.toString()}`);
        }
    });
};

export const openInStore = async ({ appName, appStoreId, appStoreLocale = 'us', playStoreId }) => {
    if (Platform.OS === 'ios') {
        Linking.openURL(`https://apps.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`);
    } else {
        Linking.openURL(
            `https://play.google.com/store/apps/details?id=${playStoreId}`
        );
    }
};
