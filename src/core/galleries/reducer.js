
import {
  HYDRATE_GALLERIES,
  HYDRATE_PENDING_GALLERIES,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR,
  IMAGES_LOADED_ENABLED,
  SEND_GALLERIES_TOAST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_ERROR,
  CLEAR_GALLERIES_TOAST,
  TOGGLE_GALLERY_DELETE,
  DELETE_GALLERY_IMAGES,
  RESET_IMAGES_TAGGED_FOR_DELETION,
  TAG_IMAGE_FOR_DELETION,
  HIGHLIGHT_GALLERIES_LINK
} from './action-types';
import forIn from 'lodash.forin';
import { activeGalleries } from './gsUtils';

export const initialState = {
  categories: {},
  images: {},
  ['pending-galleries']: {},
  toast: {},
  galleryDeleteEnabled: false,
  highlightGalleriesLink: false,
  seqImagesLoadedEnabled: false,
  taggedForDeleteCount: 0
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

// loop through galleries & reset shouldDelete state
function resetTaggedForDeleteGalleries(state) {
  // reset shouldDelete value for galleries
  const { galleries, galleriesKey } = activeGalleries(state);
  let resetGalleries = {};

  forIn(galleries, (gallery, key) => {
    resetGalleries[key] = gallery.map(image => {
      return {
        ...image,
        shouldDelete: false
      };
    });
  });

  return {
    ...state,
    [galleriesKey]: resetGalleries,
    taggedForDeleteCount: 0
  };
}

function getTaggedForDeleteCount(galleries) {
  let taggedForDeleteCount = 0;

  forIn(galleries, gallery => {
    gallery.forEach(image => {
      if (image.shouldDelete) {
        taggedForDeleteCount++;
      }
    });
  });

  return taggedForDeleteCount;
}

// tag a given imageId for deletion
function taggedForDeleteGalleries(state, action) {
  const { galleries, galleriesKey } = activeGalleries(state);
  const gallery = galleries[action.payload.category].map(image => {
    const selectedImage = image.id === action.payload.imageId;
    let shouldDelete;
    if (selectedImage) {
      shouldDelete = image.shouldDelete ? !image.shouldDelete : true;
    }
    const ifShouldntDelete = selectedImage ? false : image.shouldDelete; // if image isn't selected image ... use it's current state
    return {
      ...image, // this check allows for selecting and deselecting images
      shouldDelete: shouldDelete ? shouldDelete : ifShouldntDelete // while retaining other images delete state
    };
  });

  const taggedForDeleteGalleries = { ...galleries, [action.payload.category]: gallery };
  const taggedForDeleteCount = getTaggedForDeleteCount(taggedForDeleteGalleries);

  return {
    ...state,
    [galleriesKey]: taggedForDeleteGalleries,
    taggedForDeleteCount
  };
}

function getGalleryData(payload) {
  const { categories, images } = payload;
  return {
    categories,
    images
  };
}

export function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case IMAGES_LOADED_ENABLED:
      return {
        ...state,
        seqImagesLoadedEnabled: action.payload
      };

    case SEND_GALLERIES_TOAST:
      return {
        ...state,
        toast: action.payload
      };

    case CLEAR_GALLERIES_TOAST:
      return {
        ...state,
        toast: {}
      };

    case HYDRATE_GALLERIES:
      return {
        ...state,
        ...getGalleryData(action.payload)
      };

    case HYDRATE_PENDING_GALLERIES:
      return {
        ...state,
        ['pending-galleries']: action.payload
      };

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case CREATE_CATEGORY_ERROR:
      return {
        ...state,
        toast: errorToast
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
        forceImagesLoadedOff: action.payload, // force images loaded off while deleting imgs otherwise perf is horrible since
        seqImagesLoadedEnabled: !action.payload, // imagesLoaded rebinds on all images in gallery container which is really slow
        galleryDeleteEnabled: action.payload
      };

    case DELETE_GALLERY_IMAGES:
      return {
        ...state
      };

    case TAG_IMAGE_FOR_DELETION:
      return taggedForDeleteGalleries(state, action);

    case RESET_IMAGES_TAGGED_FOR_DELETION:
      return resetTaggedForDeleteGalleries(state, action);

    case HIGHLIGHT_GALLERIES_LINK:
      return {
        ...state,
        highlightGalleriesLink: action.payload
      };

    default:
      return state;
  }
}
