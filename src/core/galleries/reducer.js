
import {
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  INIT_GALLERIES,
  SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
  TOGGLE_GALLERY_EDIT
} from './action-types';


export const initialState = {
  homeGalleryOne: [],
  homeGalleryTwo: [],
  galleries: [],
  editing: {}
};


export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_HOME_GALLERY_ONE:
      return {
        ...state,
        homeGalleryOne: action.payload
      };

    case INIT_HOME_GALLERY_TWO:
      return {
        ...state,
        homeGalleryTwo: action.payload
      };

    case INIT_GALLERIES:
      return {
        ...state,
        galleries: action.payload
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_ERROR:
      return {
        ...state,
        galleries: action.payload
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        galleries: action.payload
      };

    case TOGGLE_GALLERY_EDIT:
      let newState = {};
      if (action.payload.galleryindex === 'homeGalleryOne') {
        const homeGalleryOne = state.homeGalleryOne.map(gallery => {
          return {
            ...gallery,
            editing: action.payload.id === gallery.id ? !gallery.editing : gallery.editing
          };
        });
        newState = {
          ...state,
          homeGalleryOne
        };
      }
      else if (action.payload.galleryindex === 'homeGalleryTwo') {
        const homeGalleryTwo = state.homeGalleryTwo.map(gallery => {
          return {
            ...gallery,
            editing: action.payload.id === gallery.id ? !gallery.editing : gallery.editing
          };
        });
        newState = {
          ...state,
          homeGalleryTwo
        };
      }
      return newState;

    default:
      return state;
  }
}
