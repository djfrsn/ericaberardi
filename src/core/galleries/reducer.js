
import {
  HYDRATE_GALLERIES,
  HYDRATE_PENDING_GALLERIES,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR,
  CLEAR_GALLERIES_TOAST,
  TOGGLE_GALLERY_DELETE,
  TAG_IMAGE_FOR_DELETION,
  HIGHLIGHT_GALLERIES_LINK
} from './action-types';
import { fObjectToObjectArray, mergeObjectArrays } from 'lava';

export const initialState = {
  galleries: {},
  ['pending-galleries']: {},
  toast: {},
  galleryDeleteEnabled: false,
  highlightGalleriesLink: false,
  seqImagesLoadedEnabled: true
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

function taggedForDeleteGalleries(state, action) {
  const pendingGalleries = state['pending-galleries'];
  const hasPendingGalleries = Object.keys(pendingGalleries).length > 0;
  const stateKey = hasPendingGalleries ? 'pending-galleries' : 'galleries';
  const galleries = hasPendingGalleries ? pendingGalleries : state.galleries.galleries;
  const gallery = galleries[action.payload.category].map(image => {
    return {
      ...image,
      shouldDelete: image.id === action.payload.imageId ? true : (image.shouldDelete || false)
    };
  });
  return {
    ...state,
    [stateKey]: { ...state.galleries, [action.payload.category]: gallery }
  };
}

export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_GALLERIES_TOAST:
      return {
        ...state,
        toast: {}
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

    case TOGGLE_GALLERY_DELETE:
      return {
        ...state,
        seqImagesLoadedEnabled: !action.payload,
        galleryDeleteEnabled: action.payload
      };

    case TAG_IMAGE_FOR_DELETION:
      return taggedForDeleteGalleries(state, action);

    case HIGHLIGHT_GALLERIES_LINK:
      return {
        ...state,
        highlightGalleriesLink: action.payload
      };

    default:
      return state;
  }
}
