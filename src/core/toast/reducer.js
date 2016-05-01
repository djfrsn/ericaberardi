
import {
  INIT_TOAST,
  SHOW_TOAST
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

    case SHOW_TOAST:
      return {
        firstLine: action.payload.firstLine,
        secondLine: action.payload.secondLine,
        toastType: action.payload.type
      };

    default:
      return state;
  }
}
