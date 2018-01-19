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
};

// Action Creators
export const actions = {
  login: (email, password) => ({
    type: 'API_CALL',
    payload: {
      method: 'POST',
      path: '/auth/login',
      body: {
        email,
        password,
      },
      types: [constants.LOGIN_START, constants.LOGIN_SUCCESS, constants.LOGIN_ERROR],
    },
  }),
  logout: () => ({
    type: constants.LOGOUT,
  }),
  getUser: token => ({
    type: 'API_CALL',
    payload: {
      method: 'GET',
      path: '/users/me',
      token,
      types: [constants.GET_USER_START, constants.GET_USER_SUCCESS, constants.GET_USER_ERROR],
    },
  }),
  setToken: token => ({
    type: constants.SET_TOKEN,
    payload: {
      token,
    },
  }),
};

// Reducer
export const initialState = {
  user: null,
  token: null,
  isLoading: false,
}; // exporting initial state just for testing purposes.
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.LOGOUT:
      return { ...initialState };
    case constants.LOGIN_START:
      return { ...state, isLoading: true };
    case constants.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload.data.token,
        user: {
          id: action.payload.data.id,
          name: action.payload.data.name,
        },
      };
    case constants.LOGIN_ERROR:
      return { ...state, isLoading: false };
    case constants.GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: state.token,
        user: {
          id: action.payload.data.id,
          name: action.payload.data.name,
        },
      };
    case constants.GET_USER_ERROR:
      return {
        ...state,
        token: null,
        user: null,
      };
    case constants.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

// Selectors

export const selectors = {
  user: state => state.auth.user,
  token: state => state.auth.token,
  isLoading: state => state.auth.isLoading,
};

export default actions;
