import { combineReducers } from 'redux';
// reducers
import { reducer as navigatorReducer } from './modules/navigatorModule';
import { reducer as modalReducer } from './modules/modalModule';
import { reducer as authReducer } from './modules/authModule';

export default combineReducers({
  navigator: navigatorReducer,
  auth: authReducer,
  modal: modalReducer,
});
