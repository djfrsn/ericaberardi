import {
  IMAGES_LOADED_ENABLED,
  SEND_GALLERIES_TOAST,
  CLEAR_GALLERIES_TOAST,
  HYDRATE_GALLERIES,
  HYDRATE_PENDING_GALLERIES,
  TOGGLE_GALLERY_DELETE,
  DELETE_GALLERY_IMAGES,
  TAG_IMAGE_FOR_DELETION,
  RESET_IMAGES_TAGGED_FOR_DELETION,
  HIGHLIGHT_GALLERIES_LINK,
  UPLOAD_GALLERY_IMAGE_SUCCESS,
  UPLOAD_GALLERY_IMAGE_ERROR
} from './action-types';
import { ENV } from 'config';
import forIn from 'lodash.forin';
import { activeGalleries } from './gsUtils';
import utils from 'utils';

export function clearGalleriesToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_GALLERIES_TOAST
    });
  };
}
export function sendGalleriesToast(toast) {
  return dispatch => {
    dispatch({
      type: SEND_GALLERIES_TOAST,
      payload: toast
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

export function seqImagesLoadedEnabled(toggle) {
  return dispatch => {
    dispatch({
      type: IMAGES_LOADED_ENABLED,
      payload: toggle
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

export function onGalleryDeleteImages(successCallback) {
  return (dispatch, getState) => {
    const { firebase, galleries } = getState();

    const aGalleries = activeGalleries(galleries).galleries;
    const storage = firebase.storage();

    forIn(aGalleries, gallery => {
      gallery.forEach(image => {
        if (image.shouldDelete) {
          // TODO: call if all files have been deleted....keep count since we know how many are selected
          // set a 30 sec timeout to run and see if success callback failed, then warn that some imgs may not have been deleted
          // if (utils.isFunction(successCallback)) {
          //   successCallback(); // TODO: break utils into named functions
          // }
          // Create a reference to the file to delete
          const storageRef = storage.ref();
          const imageRef = storageRef.child(image.fullPath);
          debugger

          // Delete the file
          // imageRef.delete().then(function() {
          //   // File deleted successfully

          // }).catch(function(error) {
          //   // Uh-oh, an error occurred!
          // });
        }
      });
    });

    dispatch({
      type: DELETE_GALLERY_IMAGES
    });
  };
}


export function resetTaggedForGalleryDelete() {
  return dispatch => {
    dispatch({
      type: RESET_IMAGES_TAGGED_FOR_DELETION
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
