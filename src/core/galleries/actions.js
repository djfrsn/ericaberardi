import {
  CLEAR_GALLERIES_TOAST,
  HYDRATE_GALLERIES,
  HYDRATE_PENDING_GALLERIES,
  TOGGLE_GALLERY_DELETE,
  TAG_IMAGE_FOR_DELETION,
  HIGHLIGHT_GALLERIES_LINK,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR
} from './action-types';
import { ENV } from 'config';
import utils from 'utils';

export function clearGalleriesToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_GALLERIES_TOAST
    });
  };
}

export function hydrateGalleries(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_GALLERIES,
      payload: data
    });
  };
}


export function hydratePendingGalleries(snapshot) {
  return dispatch => {
    dispatch({
      type: HYDRATE_PENDING_GALLERIES,
      payload: snapshot
    });
  };
}

export function toggleGalleryDelete() {
  return (dispatch, getState) => {
    const { galleries } = getState();
    dispatch({
      type: TOGGLE_GALLERY_DELETE,
      payload: !galleries.galleryDeleteEnabled
    });
  };
}

export function tagImgForDeletion(data) {
  return dispatch => {
    dispatch({
      type: TAG_IMAGE_FOR_DELETION,
      payload: { imageId: data.imageId, category: data.category }
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
  const database = firebase.database();
  database.ref(`${ENV}/pendingUpdates/galleries/${imageData.category}`).push(imageData);
}

export function uploadGalleryImage(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    const category = data.category;
    const storage = firebase.storage();
    const storageRef = storage.ref().child(category);

    const filesLength = data.files.length - 1;

    data.files.forEach((file, key) => {

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
        const { contentType, downloadURLs, fullPath, name, size, timeCreated } = imageMeta;
        // TODO: push imageData to pendingGalleryImages/category
        // set listener in main.js to call mergePendingImages galleries action
        const imageData = { id, src, category, contentType, downloadURLs, fullPath, name, size, timeCreated, pending: true };

        if (filesLength === key) { // dispatch success message after last image is successfully uploaded
          dispatch({
            type: UPLOAD_GALLERY_IMAGE_SUCCESS
          });
        }

        pushImageData(dispatch, firebase, imageData);
      });
    });
  };
}
