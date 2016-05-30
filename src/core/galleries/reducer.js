
import {
  CLEAR_GALLERIES_TOAST,
  TOGGLE_GALLERY_DELETE,
  HYDRATE_GALLERIES,
  HYDRATE_PENDING_GALLERIES,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR,
  HIGHLIGHT_GALLERIES_LINK
} from './action-types';
import { fObjectToObjectArray, mergeObjectArrays } from 'lava';

export const initialState = {
  galleries: {},
  ['pending-galleries']: {},
  toast: {},
  galleryDeleteEnable: false,
  highlightGalleriesLink: false
};

const successToast = {
  firstLine: 'Success!',
  secondLine: 'Image updates are now pending, publish to go live!.',
  type: 'success'
};

const errorToast = {
  firstLine: 'Error!',
  secondLine: 'The update was unsuccessful, please try again.',
  type: 'error'
};

// merge published galleries w/ pending galleries :)
function mergeGalleries(state, action) {
  const pendingGalleries = fObjectToObjectArray(action.payload);
  return mergeObjectArrays(state.galleries, pendingGalleries);
}

export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_GALLERIES_TOAST:
      return {
        ...state,
        toast: {}
      };

    case TOGGLE_GALLERY_DELETE:
      return {
        ...state,
        galleryDeleteEnable: action.payload
      };

    case HYDRATE_GALLERIES:
      return {
        ...state,
        galleries: action.payload
      };

    case HYDRATE_PENDING_GALLERIES:
      return {
        ...state,
        ['pending-galleries']: action.payload ? mergeGalleries(state, action) : {}
      };

    case UPLOAD_GALLERY_IMAGE_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case UPLOAD_GALLERY_IMAGE_ERROR:
      return {
        ...state,
        toast: errorToast
      };

    case HIGHLIGHT_GALLERIES_LINK:
      return {
        ...state,
        highlightGalleriesLink: action.payload
      };

    default:
      return state;
  }
}
