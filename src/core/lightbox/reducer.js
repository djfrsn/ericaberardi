
import {
  INIT_LIGHTBOX
} from './action-types';


export const initialState = {
  slides: {},
  meta: {},
  show: false
};


export function lightboxReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_LIGHTBOX:
      return {
        ...state
      };

    default:
      return state;
  }
}
