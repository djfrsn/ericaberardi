
import {
  CREATE_PLACEHOLDER_IMAGES,
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  CLEAR_TOAST,
  INIT_GALLERIES,
  SUBMIT_NEW_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_NEW_GALLERY_IMAGE_UPDATE_ERROR,
  SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
  TOGGLE_GALLERY_EDIT
} from './action-types';


export const initialState = {
  homeGalleryOne: [],
  homeGalleryTwo: [],
  galleries: [],
  editing: {},
  placeholderImages: [],
  toast: {}
};

const successToast = {
  firstLine: 'Success!',
  secondLine: 'Updates are now pending, publish to go live!.',
  type: 'success'
};

const errorToast = {
  firstLine: 'Error!',
  secondLine: 'The update was unsuccessful, please try again.',
  type: 'error'
};

export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TOAST:
      return {
        ...state,
        toast: {}
      };

    case CREATE_PLACEHOLDER_IMAGES:
      return {
        ...state,
        placeholderImages: action.payload
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

    case SUBMIT_NEW_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        toast: errorToast
      };

    case SUBMIT_NEW_GALLERY_IMAGE_UPDATE_ERROR:
      return {
        ...state,
        toast: successToast
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_ERROR:
      return {
        ...state,
        toast: errorToast
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
