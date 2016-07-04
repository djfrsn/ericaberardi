
import {
  CG_HYDRATE_GALLERIES,
  CG_UPLOAD_GALLERY_IMAGE_SUCCESS,
  CG_UPLOAD_GALLERY_ERROR,
  CG_IMAGES_LOADED_ENABLED,
  CG_SEND_GALLERIES_TOAST,
  CG_CREATE_CATEGORY_SUCCESS,
  CG_CREATE_CATEGORY_ERROR,
  CG_CLEAR_GALLERIES_TOAST,
  CG_TOGGLE_GALLERY_DELETE,
  CG_DELETE_GALLERY_IMAGES,
  CG_RESET_IMAGES_TAGGED_FOR_DELETION,
  CG_TAG_IMAGE_FOR_DELETION,
  CG_CHANGE_CATEGORY_IMAGE_ORDER,
  CG_CHANGE_GALLERY_IMAGE_ORDER,
  CG_CHANGE_CATEGORY_PREVIEW_IMAGE
} from './action-types';
import forIn from 'lodash.forin';

export const initialState = {
  categories: {},
  images: {},
  zip: {},
  toast: {},
  galleriesHydrated: false,
  galleryDeleteEnabled: false,
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
  // reset shouldDelete value for all images
  const { images } = state;
  let resetGalleries = {};

  forIn(images, (gallery, key) => {
    resetGalleries[key] = {};
    forIn(gallery, (image, id) => {
      resetGalleries[key][id] = {
        ...image,
        shouldDelete: false
      };
    });
  });

  return {
    ...state,
    images: resetGalleries,
    taggedForDeleteCount: 0
  };
}

function getTaggedForDeleteCount(galleries) {
  let taggedForDeleteCount = 0;

  forIn(galleries, gallery => {
    forIn(gallery, image => {
      if (image.shouldDelete) {
        taggedForDeleteCount++;
      }
    });
  });

  return taggedForDeleteCount;
}

// tag a given imageId for deletion
function taggedForDeleteGalleries(state, action) {
  const { images } = state;
  const gallery = {};

  forIn(images[action.payload.categoryId], (image, id) => {
    const selectedImage = image.id === action.payload.imageId;
    let shouldDelete;
    if (selectedImage) {
      shouldDelete = image.shouldDelete ? !image.shouldDelete : true; // toggle shouldDelete state if it exist other set true
    }
    const ifShouldntDelete = selectedImage ? false : (image.shouldDelete || false); // if image isn't selected image ... use it's current state or false if it hasn't been set yet
    gallery[id] = {
      ...image, // this check allows for selecting and deselecting images
      shouldDelete: shouldDelete ? shouldDelete : ifShouldntDelete // while retaining other images delete state
    };
  });

  const taggedForDeleteGalleries = { ...images, [action.payload.categoryId]: gallery };
  const taggedForDeleteCount = getTaggedForDeleteCount(taggedForDeleteGalleries);

  return {
    ...state,
    images: taggedForDeleteGalleries,
    taggedForDeleteCount
  };
}

function mergeImages(state, payload) {
  const { gallery, categoryId } = payload;
  let images = { ...state.images };

  images[categoryId] = gallery;

  return {images};
}

function getGalleryData(payload) {
  const { categories, images, zip } = payload.snapshot;
  return {
    categories,
    images,
    zip
  };
}

export function customerGalleriesReducer(state = initialState, action) {
  switch (action.type) {
    case CG_IMAGES_LOADED_ENABLED:
      return {
        ...state,
        seqImagesLoadedEnabled: action.payload
      };

    case CG_SEND_GALLERIES_TOAST:
      return {
        ...state,
        toast: action.payload
      };

    case CG_CLEAR_GALLERIES_TOAST:
      return {
        ...state,
        toast: {}
      };

    case CG_HYDRATE_GALLERIES:
      return {
        ...state,
        galleriesHydrated: true,
        ...getGalleryData(action.payload)
      };

    case CG_CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case CG_CREATE_CATEGORY_ERROR:
      return {
        ...state,
        toast: errorToast
      };

    case CG_UPLOAD_GALLERY_IMAGE_SUCCESS:
      return {
        ...state,
        toast: successToast
      };

    case CG_UPLOAD_GALLERY_ERROR:
      return {
        ...state,
        toast: errorToast
      };

    case CG_TOGGLE_GALLERY_DELETE:
      return {
        ...state,
        forceImagesLoadedOff: action.payload, // force images loaded off while deleting imgs otherwise perf is horrible since
        seqImagesLoadedEnabled: !action.payload, // imagesLoaded rebinds on all images in gallery container which is really slow
        galleryDeleteEnabled: action.payload
      };

    case CG_DELETE_GALLERY_IMAGES:
      return {
        ...state
      };

    case CG_TAG_IMAGE_FOR_DELETION:
      return taggedForDeleteGalleries(state, action);

    case CG_RESET_IMAGES_TAGGED_FOR_DELETION:
      return resetTaggedForDeleteGalleries(state, action);

    case CG_CHANGE_CATEGORY_PREVIEW_IMAGE:
      return {
        ...state,
        ...mergeImages(state, action.payload)
      };

    case CG_CHANGE_GALLERY_IMAGE_ORDER:
      return {
        ...state,
        ...mergeImages(state, action.payload)
      };

    case CG_CHANGE_CATEGORY_IMAGE_ORDER:
      return {
        ...state,
        categories: action.payload.categories
      };

    default:
      return state;
  }
}
