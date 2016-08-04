
import {
  HYDRATE_CONTACT,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_ERROR,
  CLEAR_EMAIL_DATA
} from './action-types';


const emailInitialState = {
  success: false,
  err: []
};

export const initialState = {
  email: emailInitialState,
  content: {}
};


export function contactReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_CONTACT:
      return {
        ...state,
        content: action.payload
      };
    case SEND_EMAIL_SUCCESS:
      return {
        ...state,
        email: action.payload.validation
      };

    case SEND_EMAIL_ERROR:
      return {
        ...state,
        email: action.payload.validation
      };

    case CLEAR_EMAIL_DATA:
      return {
        ...state,
        email: emailInitialState
      };

    default:
      return state;
  }
}
