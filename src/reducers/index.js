import { combineReducers } from 'redux'
import auth from './auth'
import preference from './preference'

//{append_include_here}

const rootReducer = combineReducers({
  auth,
  preference
});

export default rootReducer;
