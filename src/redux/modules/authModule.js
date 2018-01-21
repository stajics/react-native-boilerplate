import firebase from 'react-native-firebase';
// Constants

export const constants = {
  LOGOUT: 'LOGOUT',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  GET_USER_START: 'GET_USER_START',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  GET_USER_ERROR: 'GET_USER_ERROR',
  SET_TOKEN: 'SET_TOKEN',
  UPDATE_USER: 'UPDATE_USER',
};

// Action Creators
export const actions = {
  login: (email, password) => async (dispatch) => {
    try {
      dispatch({ type: constants.LOGIN_START });
      const user = await firebase.auth().signInWithEmailAndPassword(email, password);
      return dispatch({ type: constants.LOGIN_SUCCESS, payload: user });
    } catch (error) {
      return dispatch({ type: constants.LOGIN_ERROR, payload: error, error: true });
    }
  },
  logout: () => async (dispatch) => {
    try {
      await firebase.auth().signOut();
      return dispatch({ type: constants.LOGOUT });
    } catch (error) {
      return dispatch({ type: constants.LOGOUT });
    }
  },
  updateUser: user => ({
    type: constants.UPDATE_USER,
    payload: {
      user,
    },
  }),
};

// Reducer
export const initialState = {
  user: null,
  isLoading: false,
}; // exporting initial state just for testing purposes.
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.LOGOUT:
      return { ...initialState };
    case constants.LOGIN_START:
      return { ...state, isLoading: true };
    case constants.LOGIN_SUCCESS:
    case constants.LOGIN_ERROR:
      return { ...state, isLoading: false };
    case constants.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

// Selectors

export const selectors = {
  user: state => state.auth.user,
  isLoading: state => state.auth.isLoading,
};

export default actions;
