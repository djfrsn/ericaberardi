import {
  CUSTOMER_SIGN_IN_SUCCESS,
  HYDRATE_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_OUT_SUCCESS,
  RESET_AUTH_MESSAGES
} from './action-types';


export const initialState = {
  authenticated: false,
  isApprovedCustomer: false,
  id: null,
  secretId: null
};


export function authReducer(state = initialState, action) {
  const { payload } = action;
  let authenticated = payload !== null;

  switch (action.type) {
    case HYDRATE_AUTH:
      return {
        authenticated,
        userEmail: authenticated ? payload.email : null,
        id: authenticated ? payload.uid : null
      };

    case CUSTOMER_SIGN_IN_SUCCESS:
      return {
        ...state,
        isApprovedCustomer: true,
        secretId: action.payload.secretId
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
