
import {
  INIT_TOAST
} from './action-types';


export const initialState = {
  toast: {}
};


export function toastReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_TOAST:
      return {
        ...state
      };

    default:
      return state;
  }
}
