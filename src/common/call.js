import { Linking, Platform } from 'react-native';

const FACEBOOK_APP_URL = 'whatsapp://send';
const FACEBOOK_MESSENGER_PLAY_STORE_ID = 'com.whatsapp';

const FACETIME_APP_URL = '';
const FACETIME_APP_STORE_ID = '';
const FACETIME_APP_STORE_LOCAL = '';
const FACETIME_APP_NAME = '';

export const openCallApp = async () => {
    let appLink = '';
    if (Platform.OS === 'ios') {
        appLink = FACETIME_APP_URL;
    } else {
        appLink = FACEBOOK_APP_URL;
    }
    Linking.openURL(appLink).catch(err => {
        if (err.code === 'EUNSPECIFIED') {
            if (Platform.OS === 'ios') {
                Linking.openURL(`https://apps.apple.com/${FACETIME_APP_STORE_LOCAL}/app/${FACETIME_APP_NAME}/id${FACETIME_APP_STORE_ID}`);
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