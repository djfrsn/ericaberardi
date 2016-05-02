
import {
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  CLEAR_TOAST,
  INIT_GALLERIES,
  SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
  TOGGLE_GALLERY_EDIT
} from './action-types';


export const initialState = {
  homeGalleryOne: [],
  homeGalleryTwo: [],
  galleries: [],
  editing: {},
  toast: {}
};


export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TOAST:
      return {
        ...state,
        toast: {}
      };

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
        toast: {
          firstLine: 'Error!',
          secondLine: 'The update was unsuccessful, please try again.',
          type: 'error'
        }
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        toast: {
          firstLine: 'Success!',
          secondLine: 'Updates are now pending, publish to go live!.',
          type: 'success'
        }
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
