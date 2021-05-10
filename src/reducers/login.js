import images from '../../assets/images';
import * as types from '../actions/types';

const initialState = {
  authorized: false,
  authorizing: false,
  failure: false,
  error: null,
  profile: {
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
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case types.APP.INIT:
      return initialState;
    case types.LOGIN.REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        failure: false,
        error: {}
      };
    case types.LOGIN.SUCCESS:
      return {
        ...state,
        authorizing: false,
        authorized: true,
        profile: action.data,
        failure: false,
        error: null
      };
    case types.LOGIN.FAILURE:
      return {
        ...state,
        authorizing: false,
        authorized: false,
        failure: true,
        error: action.err
      };
    case types.LOGOUT:
      return initialState;
    case types.USER.SET:
      return {
        ...state,
        profile: action.user
      };
    default:
      return state;
  }
}