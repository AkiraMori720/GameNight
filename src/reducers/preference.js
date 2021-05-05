import {
    UPDATE_PREFERENCE_STORE,
} from '../actions/types'

const updatePreferenceStore = (state, action) => {
    console.log('preference_store_payload_to: ', action.payload)
    return Object.assign({}, state, action.payload)
}

const ACTION_HANDLERS = {
    [UPDATE_PREFERENCE_STORE]: updatePreferenceStore
}

const initialState = {
    gameType: 'solo',
    gameStyle: 0,
    gameLobby: null,
    soloPoints: 70,
    partnerPoints: 150,
    privateMatch: false
}

export default function preferenceReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
