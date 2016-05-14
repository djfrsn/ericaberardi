import {
  CREATE_PLACEHOLDER_IMAGES,
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  CLEAR_TOAST,
  INIT_GALLERIES,
  TOGGLE_GALLERY_EDIT,
  CLEAR_IMAGE_RESET_META,
  SUBMIT_NEW_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_NEW_GALLERY_IMAGE_UPDATE_ERROR,
  SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_UPDATE_ERROR
} from './action-types';
import galleryImageDefaults from './galleryImageDefaults';
import utils from 'utils';

export function clearToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_TOAST
    });
  };
}

export function createPlaceholderImages(data) {
  return dispatch => {
    dispatch({
      type: CREATE_PLACEHOLDER_IMAGES,
      payload: data
    });
  };
}

export function initHomeGalleryOne(data) {
  return dispatch => {
    dispatch({
      type: INIT_HOME_GALLERY_ONE,
      payload: data
    });
  };
}

export function initHomeGalleryTwo(data) {
  return dispatch => {
    dispatch({
      type: INIT_HOME_GALLERY_TWO,
      payload: data
    });
  };
}

export function initGalleries(data) {
  return dispatch => {
    dispatch({
      type: INIT_GALLERIES,
      payload: data
    });
  };
}

export function toggleGalleryEdit(data) {
  return dispatch => {
    dispatch({
      type: TOGGLE_GALLERY_EDIT,
      payload: data
    });
  };
}

export function clearImageResetMeta() {
  return dispatch => {
    dispatch({
      type: CLEAR_IMAGE_RESET_META
    });
  };
}

export function submitGalleryImageUpdates(data) {
  return (dispatch, getState) => {
    const { firebase, galleries } = getState();
    let imageData = {};
    galleries[data.galleryindex].forEach(gallery => {
      const match = data.id === gallery.id;
      if (match) {
        imageData = {
          ...gallery,
          src: data.newImageUrl ? data.newImageUrl : gallery.src,
          bottomText: data.text && data.position === 'bottom' ? data.text : gallery.bottomText,
          topText: data.text && data.position === 'top' ? data.text : gallery.topText
        };
      }
    });
    if (imageData.src) {
      firebase.child(`pendingAdminChanges/${data.galleryindex}/${data.id}`)
        .set(imageData, error => {
          if (error) {
            console.error('ERROR @ submitGalleryImageUrl :', error); // eslint-disable-line no-console
            dispatch({
              type: SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
              payload: error
            });
          }
          else {
            dispatch({
              type: SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
              payload: { id: data.id, type: data.type }
            });
          }
        });
    }
  };
}

export function saveGalleryImage(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`pendingAdminChanges/${data.galleryindex}/${utils.uuid()}`)
        .set({ ...galleryImageDefaults, src: data.src, topText: data.topText, bottomText: data.bottomText }, error => {
          if (error) {
            console.error('ERROR @ submitGalleryImageUrl :', error); // eslint-disable-line no-console
            dispatch({
              type: SUBMIT_NEW_GALLERY_IMAGE_UPDATE_ERROR,
              payload: error
            });
          }
          else {
            dispatch({
              type: SUBMIT_NEW_GALLERY_IMAGE_UPDATE_SUCCESS,
              payload: { id: 'placeholder', type: data.type }
            });
          }
        });
  };
}
