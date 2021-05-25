import {
    PREFERENCE,
} from '../actions/types'
import * as types from "../actions/types";

const initialState = {
    gameType: 'solo',
    gameStyle: 0,
    gameLobby: null,
    soloPoints: 70,
    partnerPoints: 100,
    privateMatch: false
}

export default function preference(state = initialState, action) {
    switch (action.type) {
        case types.APP.INIT:
            return initialState;
        case types.PREFERENCE.SET:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}