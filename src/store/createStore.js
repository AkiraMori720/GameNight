import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import Reactotron from 'reactotron-react-native';
import thunk from 'redux-thunk'
import reducers from '../reducers'

let enhancers;

if (__DEV__) {
  const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();

  enhancers = compose(
      applyMiddleware(reduxImmutableStateInvariant),
      applyMiddleware(thunk),
      Reactotron.createEnhancer()
  );
} else {
  enhancers = compose(
      applyMiddleware(thunk)
  );
}

// ======================================================
// Store Instantiation and HMR Setup
// ======================================================
const store =  createStore(reducers, enhancers);

export default store
