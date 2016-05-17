
import {
  INIT_LIGHTBOX
} from './action-types';


export const initialState = {
  lightbox: {},
  slides: {},
  show: false
};


export function lightboxReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_LIGHTBOX:
      return {
        ...state,
        slides: action.payload.scope.state.gallery.map(image => {
          return {
            ...image,
            active: image.id === action.payload.e.currentTarget.parentElement.id ? true : false
          };
        }),
        show: true
      };

    default:
      return state;
  }
}
