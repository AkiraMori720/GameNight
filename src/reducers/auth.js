import { 
    LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, UPDATE_AUTH_INFO
  } from '../actions/types'
import images from '../../assets/images';
  
  
  const ACTION_HANDLERS = {
    [UPDATE_AUTH_INFO] : (state, action) => {
      return Object.assign({}, state, action.payload)
    },
    [LOGIN] : (state, action) => {
      return Object.assign({}, state, action.payload)
    },
    [LOGIN_SUCCESS] : (state, action) => {
      return Object.assign({}, state, action.payload)
    },
    [LOGIN_FAILED] : (state, action) => {
      return Object.assign({}, state, action.payload)
    },
    [LOGOUT] : (state, action) => {
      return Object.assign({}, state, action.payload)
    }
  }
  
  const initialState = {
    // role: 0, //0:guest 1:client 2:admin
    user: null,
    userid: null, // I set this var because I can\t see the exact snapshot result from firebase
    username: 'user',
    password: '',
    mobilePhone: '',
    homePhone: '',
    agreeTerms: false,
    birthday: '',  
    token: '',
    // profile related
    address: 'address',
    age: 20,
    crewCount: 0,
    isFirstUser: true,
    avatarId: 3,
    avatars: [images.ic_bear, images.ic_bird, images.ic_avatar0, images.ic_avatar_boy],
    skinColor:   'color1',
    accessory:   'option1',
    nailColor:   'option1',
    handTattoo:  'option1',
    spadezDeck:  'option1',
    spadezTable: 'option1',
  }
  
  export default function authReducer (state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
  }
  