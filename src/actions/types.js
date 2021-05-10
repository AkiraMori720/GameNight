export const RESTART = 'RESTART';
export const RESET = 'RESET';
export const SET_ROUNDS = 'SET_ROUNDS';
export const ADD_BIDS = 'ADD_BIDS';
export const SET_THEME = 'SET_THEME';
export const SET_COLOR = 'SET_COLOR';

export const UPDATE_GAME_STORE = 'UPDATE_GAME_STORE'
export const ADD_GAME_PLAYER = 'ADD_GAME_PLAYER'

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const defaultTypes = [REQUEST, SUCCESS, FAILURE];

function createRequestTypes(base, types = defaultTypes) {
    const res = {};
    types.forEach(type => (res[type] = `${ base }_${ type }`));
    return res;
}

export const APP = createRequestTypes('APP', ['START', 'READY', 'INIT']);

export const APP_STATE = createRequestTypes('APP_STATE', ['FOREGROUND', 'BACKGROUND', 'INACTIVE']);

// Login events
export const LOGIN = createRequestTypes('LOGIN', [
    ...defaultTypes,
    'RESET'
]);
export const LOGOUT = 'LOGOUT';

export const USER = createRequestTypes('USER', ['SET']);

export const PREFERENCE = createRequestTypes('PREFERENCE', ['SET', 'UPDATE']);
