import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]


  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store =  createStore(reducers, applyMiddleware(thunk));

export default store
