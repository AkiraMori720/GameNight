import {
    PREFERENCE
} from './types'

export function updatePreferenceStore(preference) {
    return {
        type: PREFERENCE.SET,
        data: preference
    }
}

export function setPreferences(data) {
    return {
        type: PREFERENCE.UPDATE,
        data: data
    }
}
