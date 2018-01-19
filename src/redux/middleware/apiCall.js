import { get } from 'lodash';
import { AsyncStorage } from 'react-native';
import queryString from 'query-string';
import { apiEndpoint } from '../../config/urls';

export const API_CALL = 'API_CALL';

const apiCall = async (method, path, body, qs = {}, token, contentType = 'application/json') => {
  const response = await fetch(`${apiEndpoint}${path}?${queryString.stringify(qs)}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': contentType,
      'x-session-token': token,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.status >= 400 || (get(data, 'error.details.code', 200) !== 200)) {
    throw data;
  }
  return data;
};

/* eslint no-unused-vars: "off" */
export default store => next => async (action) => {
  if (!(action.type === API_CALL)) { // Middleware will be applied only to API_CALL actions
    return next(action);
  }
  const {
    types,
    method,
    path,
    body,
    qs,
    contentType,
    token,
  } = action.payload;
  const [requestType, successType, errorType] = types;
  const niftyToken = get(store.getState(), 'auth.token');
  next({ type: requestType, action });
  try {
    const response = await apiCall(method, path, body, qs, niftyToken || token, contentType);
    return next({ type: successType, payload: response });
  } catch (error) {
    throw next({ type: errorType, payload: error, error: true });
  }
};
