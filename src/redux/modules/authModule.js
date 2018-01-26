import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
// Constants

export const constants = {
  LOGOUT: 'LOGOUT',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_ERROR: 'SIGNUP_ERROR',
  CREATE_USER_START: 'CREATE_USER_START',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_ERROR: 'CREATE_USER_ERROR',
  GET_USER_START: 'GET_USER_START',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  GET_USER_ERROR: 'GET_USER_ERROR',
  EDIT_USER_START: 'EDIT_USER_START',
  EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
  EDIT_USER_ERROR: 'EDIT_USER_ERROR',
  SET_USER: 'SET_USER',
  SET_FIREBASE_USER: 'SET_FIREBASE_USER',
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
  signup: (email, password) => async (dispatch) => {
    try {
      dispatch({ type: constants.SIGNUP_START });
      const firebaseUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
      dispatch({
        type: constants.SET_FIREBASE_USER,
        payload: {
          firebaseUser,
        },
      });
      return dispatch({ type: constants.SIGNUP_SUCCESS });
    } catch (error) {
      return dispatch({ type: constants.SIGNUP_ERROR, payload: error, error: true });
    }
  },
  logout: () => async (dispatch) => {
    try {
      await firebase.auth().signOut();
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' }),
        ],
      });
      dispatch(resetAction);
      return dispatch({ type: constants.LOGOUT });
    } catch (error) {
      return dispatch({ type: constants.LOGOUT });
    }
  },
  createUser: user => async (dispatch, getState) => {
    try {
      dispatch({ type: constants.CREATE_USER_START });
      const state = getState();
      await firebase.firestore().doc(`users/${state.auth.firebaseUser._user.uid}`).set(user);
      dispatch({
        type: constants.SET_USER,
        payload: {
          user,
        },
      });
      dispatch({ type: constants.CREATE_USER_SUCCESS });
      return user;
    } catch (error) {
      return dispatch({ type: constants.CREATE_USER_ERROR, payload: error, error: true });
    }
  },
  editUser: data => async (dispatch, getState) => {
    try {
      dispatch({ type: constants.EDIT_USER_START });
      const state = getState();
      await firebase.firestore().doc(`users/${state.auth.firebaseUser._user.uid}`).set(data, {
        merge: true,
      });
      const userRef = await firebase.firestore().doc(`users/${state.auth.firebaseUser._user.uid}`).get();
      dispatch({
        type: constants.SET_USER,
        payload: {
          user: userRef._data,
        },
      });
      dispatch({ type: constants.EDIT_USER_SUCCESS });
      return userRef._data;
    } catch (error) {
      return dispatch({ type: constants.EDIT_USER_ERROR, payload: error, error: true });
    }
  },
  getUser: userId => async (dispatch) => {
    try {
      const userRef = await firebase.firestore().doc(`users/${userId}`).get();
      if (userRef.exists) {
        dispatch({
          type: constants.SET_USER,
          payload: {
            user: userRef._data,
          },
        });
        return userRef._data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  setFirebaseUser: firebaseUser => ({
    type: constants.SET_FIREBASE_USER,
    payload: {
      firebaseUser,
    },
  }),
};

// Reducer
export const initialState = {
  user: null,
  firebaseUser: null,
  isLoading: false,
}; // exporting initial state just for testing purposes.
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.LOGOUT:
      return { ...initialState };
    case constants.LOGIN_START:
    case constants.SIGNUP_START:
      return { ...state, isLoading: true };
    case constants.LOGIN_SUCCESS:
    case constants.LOGIN_ERROR:
    case constants.SIGNUP_SUCCESS:
    case constants.SIGNUP_ERROR:
      return { ...state, isLoading: false };
    case constants.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case constants.SET_FIREBASE_USER:
      return {
        ...state,
        firebaseUser: action.payload.firebaseUser,
      };
    default:
      return state;
  }
};

// Selectors

export const selectors = {
  user: state => state.auth.user,
  firebaseUser: state => state.auth.firebaseUser,
  isLoading: state => state.auth.isLoading,
};

export default actions;
