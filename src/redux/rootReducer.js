import { combineReducers } from 'redux';
// reducers
import { reducer as appReducer } from './modules/appModule';
import { reducer as navigatorReducer } from './modules/navigatorModule';
import { reducer as authReducer } from './modules/authModule';

export default combineReducers({
  app: appReducer,
  navigator: navigatorReducer,
  auth: authReducer,
});
