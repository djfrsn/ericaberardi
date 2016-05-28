import {
  CREATE_PLACEHOLDER_IMAGES,
  CLEAR_TOAST,
  INIT_GALLERIES,
  TOGGLE_GALLERY_EDIT,
  HIGHLIGHT_GALLERIES_LINK,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR
} from './action-types';
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

export function highlightGalleriesLink(toggle) {
  return dispatch => {
    dispatch({
      type: HIGHLIGHT_GALLERIES_LINK,
      payload: toggle
    });
  };
}

export function pushImageData(dispatch, firebase, imageData) {
    debugger
    // dispatch({
    //   type: UPLOAD_GALLERY_IMAGE_ERROR,
    //   payload: error
    // });
    // dispatch({
    //   type: UPLOAD_GALLERY_IMAGE_SUCCESS,
    //   payload: { id: data.id, type: data.type }
    // });
}

export function uploadGalleryImage(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    const category = data.category;
    const storage = firebase.storage();
    const storageRef = storage.ref().child(category);

    data.files.forEach(file => {

      const imageRef = storageRef.child(file.name);
      const uploadImage = imageRef.put(file);

      uploadImage.on('state_changed', () => {
        // Observe state change events such as progress, pause, and resume
      }, error => {
        dispatch({
          type: UPLOAD_GALLERY_IMAGE_ERROR,
          payload: error
        });
      }, () => {
        // Handle successful uploads on complete
        const id = utils.uuid();
        const src = uploadImage.snapshot.downloadURL;
        const imageMeta = uploadImage.snapshot.metadata;
        // TODO: push imageData to pendingGalleryImages/category
        // set listener in main.js to call mergePendingImages galleries action
        const imageData = { id, src, imageMeta, category, pending: true };

        pushImageData(dispatch, firebase, imageData);
      });
    });
  };
}
