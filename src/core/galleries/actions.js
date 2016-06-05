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
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_ERROR,
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
  return (dispatch, getState) => {
    const { auth, galleries } = getState();
    const snapshot = data ? data : { categories: galleries.categories, images: galleries.images };
    dispatch({
      type: HYDRATE_GALLERIES,
      payload: { snapshot, auth }
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

function isValidCategory(category) {
  return typeof category === 'string' && category.length > 0;
}

export function createCategory(category) {
  const failure = dispatch => {
    dispatch({
      type: CREATE_CATEGORY_ERROR
    });
  };
  return (dispatch, getState) => {
    const { firebase } = getState();
    if (isValidCategory(category)) {
      const id = firebase.database(`${ENV}/galleries`).ref().child('categories').push().key;
      firebase.database().ref(`${ENV}/galleries/categories/${id}`).set({
        id,
        category: category.toLowerCase(),
        pending: true
      }).then(() => {
        dispatch({
          type: CREATE_CATEGORY_SUCCESS
        });
      }).catch(() => {
        failure(dispatch);
      });
    }
    else {
      failure(dispatch);
    }
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
    const storage = firebase.storage();
    let imagesDeletedCount = 0;
    const taggedForDeleteCount = galleries.taggedForDeleteCount;
    let success = false;

    forIn(galleries.images, gallery => {
      forIn(gallery, image => {
        if (image.shouldDelete) {
          // call if all files have been deleted....keep count since we know how many are selected
          // TODO: place this inside img delete callback
          imagesDeletedCount++;
          if (imagesDeletedCount === taggedForDeleteCount) {
            success = true;
            successCallback();
          }
          // TODO: for each file that is deleted the meta data must also be removed from firebase
          console.log(image, `${ENV}/galleries/${image.categoryId}/${image.id}`);
          // firebase.database().ref(`${ENV}/galleries/${image.categoryId}/${image.id}`).set(null).then(() => {
          //   const storageRef = storage.ref();
          //   // Create a reference to the file to delete
          //   const imageRef = storageRef.child(image.fullPath);
          //   imageRef.delete().then(function() {
          //     // File deleted successfully
          //     imagesDeletedCount++;
          //   }).catch(function(error) {
          //     // Uh-oh, an error occurred!
          //     // log errors to env/logs/errors/galleries/shouldDelete/image.id = image
          //   });
          // }).catch(error => {
          //   // err :(
          //   // TODO: dispatch alert for image deletion error...pass name of image along... in msg
          // });
        }
      });

      setTimeout(() => {
        if (!success) {
          // TODO: set a 45 sec timeout to run and see if success callback failed, then warn that some imgs may not have been deleted
          successCallback();
        }
      }, 45000);
      // TODO: loop galleries and check imagesToDelete id's to remove meta data from galleries & pending-galleries

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
      payload: { imageId: data.imageId, categoryId: data.categoryId }
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
  database.ref(`${ENV}/galleries/images/${imageData.categoryId}/${imageData.id}`).set(imageData);
}

export function uploadGalleryImage(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    const { category, categoryId } = data;
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

        const id = firebase.database(`${ENV}/galleries/images`).ref().child(`${categoryId}`).push().key;
        const src = uploadImage.snapshot.downloadURL;
        const imageMeta = uploadImage.snapshot.metadata;
        const { contentType, downloadURLs, fullPath, name, size, timeCreated } = imageMeta;
        // TODO: push imageData to pendingGalleryImages/category
        // set listener in main.js to call mergePendingImages galleries action

        const imageData = { id, src, category, categoryId, contentType, downloadURLs, fullPath, name, size, timeCreated, pending: true };

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
