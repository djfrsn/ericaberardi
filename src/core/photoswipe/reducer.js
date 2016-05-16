
import {
  INIT_PHOTOSWIPE
} from './action-types';


export const initialState = {
  lightbox: {}
};


export function toastReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_PHOTOSWIPE:
      return {
        ...state
      };

    default:
      return state;
  }
}
