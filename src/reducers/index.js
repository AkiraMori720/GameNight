import { combineReducers } from 'redux'
import login from './login'
import preference from './preference'
import app from "./app";

//{append_include_here}

export default combineReducers({
  app,
  login,
  preference
});