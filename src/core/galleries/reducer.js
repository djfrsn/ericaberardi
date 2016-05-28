
import {
  CLEAR_TOAST,
  INIT_GALLERIES,
  INIT_PENDING_GALLERIES,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_ERROR,
  HIGHLIGHT_GALLERIES_LINK
} from './action-types';
import { fObjectToObjectArray, mergeObjectArrays } from 'lava';

export const initialState = {
  galleries: {},
  pendingGalleries: {},
  toast: {},
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

// merge published galleries pending galleries :)
function mergeGalleries(state, action) {
  const pendingGalleries = fObjectToObjectArray(action.payload);
  return mergeObjectArrays(state.galleries, pendingGalleries);
}

export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TOAST:
      return {
        ...state,
        toast: {}
      };

    case INIT_GALLERIES:
      return {
        ...state,
        galleries: action.payload
      };

    case INIT_PENDING_GALLERIES:
      return {
        ...state,
        pendingGalleries: mergeGalleries(state, action)
      };

    case UPLOAD_GALLERY_IMAGE_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case SUBMIT_GALLERY_IMAGE_ERROR:
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
