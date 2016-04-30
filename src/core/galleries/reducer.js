
import {
  INIT_HOME_GALLERY,
  INIT_GALLERIES
} from './action-types';


export const initialState = {
  homeGallery: [],
  galleries: []
};


export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_HOME_GALLERY:
    debugger
      return {
        homeGallery: []
      };

    case INIT_GALLERIES:
      return {
        galleries: []
      };

    default:
      return state;
  }
}
