
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
      return {
        ...state,
        homeGallery: action.payload
      };

    case INIT_GALLERIES:
      return {
        ...state,
        galleries: action.payload
      };

    default:
      return state;
  }
}
