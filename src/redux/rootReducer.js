import { combineReducers } from 'redux';
// reducers
import { reducer as modalReducer } from './modules/modalModule';
import { reducer as authReducer } from './modules/authModule';

export default combineReducers({
  auth: authReducer,
  modal: modalReducer,
});
