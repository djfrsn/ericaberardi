
import {
  CREATE_PLACEHOLDER_IMAGES,
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  CLEAR_TOAST,
  INIT_GALLERIES,
  CLEAR_IMAGE_RESET_META,
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
  toast: {},
  imageResetMeta: []
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

    case CLEAR_IMAGE_RESET_META:
      return {
        ...state,
        imageResetMeta: []
      };

    case SUBMIT_NEW_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        toast: successToast,
        imageResetMeta: action.ids.map(id => {
          return { id: id };
        })
      };

    case SUBMIT_NEW_GALLERY_IMAGE_UPDATE_ERROR:
      return {
        ...state,
        toast: errorToast
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS:
      return {
        ...state,
        toast: successToast,
        imageResetMeta: action.ids.map(id => {
          return { id: id };
        })
      };

    case SUBMIT_GALLERY_IMAGE_UPDATE_ERROR:
      return {
        ...state,
        toast: errorToast
      };

    case TOGGLE_GALLERY_EDIT:
      let newState = {};
      debugger
      switch (action.payload.galleryindex) {
        case 'homeGalleryOne':
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
          break;
        case 'homeGalleryOnePending':
          const homeGalleryOnePending = state.homeGalleryTwo.map(gallery => {
            return {
              ...gallery,
              editing: action.payload.id === gallery.id ? !gallery.editing : gallery.editing
            };
          });
          newState = {
            ...state,
            homeGalleryOnePending
          };
          break;
        case 'homeGalleryTwo':
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
          break;
        case 'homeGalleryTwoPending':
          const homeGalleryTwoPending = state.homeGalleryTwo.map(gallery => {
            return {
              ...gallery,
              editing: action.payload.id === gallery.id ? !gallery.editing : gallery.editing
            };
          });
          newState = {
            ...state,
            homeGalleryTwoPending
          };
          break;

        default:
          return;
      }
      return newState;

    default:
      return state;
  }
}
