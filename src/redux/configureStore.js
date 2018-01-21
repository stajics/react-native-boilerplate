import { applyMiddleware, createStore, compose } from 'redux';
// middleware
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import apiCall from './middleware/apiCall';
import rootReducer from './rootReducer';

const middleware = [thunk, apiCall, logger];

const configureStore = (initialState = undefined) => {
  const store = compose(applyMiddleware(...middleware))(createStore)(rootReducer, initialState);
  return store;
};

export default configureStore;
