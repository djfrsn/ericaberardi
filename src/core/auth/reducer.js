import {
  INIT_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_OUT_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  RESET_AUTH_MESSAGES
} from './action-types';


export const initialState = {
  authenticated: false,
  id: null
};


export function authReducer(state = initialState, action) {
  const { meta, payload } = action;

  switch (action.type) {
    case INIT_AUTH:
      let authenticated = payload !== null && (payload.expires * 1000) > meta.timestamp;
      return {
        authenticated,
        userEmail: authenticated && payload.password ? payload.password.email : null,
        id: authenticated ? payload.uid : null
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        userEmail: payload.password ? payload.password.email : null,
        id: payload.uid
      };

    case SIGN_IN_ERROR:
      return {
        authenticated: false,
        signInError: payload,
        id: null
      };

    case SIGN_OUT_SUCCESS:
      return {
        authenticated: false,
        id: null
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordSuccess: true
      };

    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        changePasswordError: true
      };

    case RESET_AUTH_MESSAGES:
      return {
        ...state,
        changePasswordError: false,
        changePasswordSuccess: false,
        signInError: false
      };

    default:
      return state;
  }
}
