
import {
  INIT_TOAST,
  CLEAR_TOAST,
  SHOW_TOAST
} from './action-types';


export const initialState = {
  toast: {},
  toastComplete: false
};


export function toastReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_TOAST:
      return {
        ...state
      };

    case CLEAR_TOAST:
      return {
        ...state,
        toastComplete: true
      };

    case SHOW_TOAST:
      return {
        toastComplete: false,
        firstLine: action.payload.firstLine,
        secondLine: action.payload.secondLine,
        toastType: action.payload.type
      };

    default:
      return state;
  }
}
