// Constants
import { constants as authConstants } from './authModule';

export const constants = {
  LOGOUT: 'LOGOUT',
};

// Action Creators
export const actions = {
};

// Reducer
export const initialState = {
  isStartingUp: true,
  isLoading: false,
}; // exporting initial state just for testing purposes.
export const reducer = (state = initialState, action) => {
  if (action.type.startsWith('Navigation/')) {
    return {
      ...state,
      isStartingUp: false,
    };
  }
  switch (action.type) {
    case authConstants.SET_USER:
      return {
        ...state,
        isStartingUp: false,
      };
    case authConstants.SET_FIREBASE_USER:
      if (!action.payload.firebaseUser) {
        return {
          ...state,
          isStartingUp: false,
        };
      }
      return {
        ...state,
      };
    default:
      return state;
  }
};

// Selectors

export const selectors = {
  isStartingUp: state => state.app.isStartingUp,
  isLoading: state => state.app.isLoading,
};

export default actions;
