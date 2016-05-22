
import {
  SEND_EMAIL
} from './action-types';


export const initialState = {
  email: {
    status: ''
  }
};


export function contactReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_EMAIL:
      return {
        ...state
      };

    default:
      return state;
  }
}
