
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
      // merge published galleries pending galleries :)
      const pendingGalleries = fObjectToObjectArray(action.payload);
      const mergedGalleries = mergeObjectArrays(state.galleries, pendingGalleries);
      return {
        ...state,
        galleries: mergedGalleries
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
