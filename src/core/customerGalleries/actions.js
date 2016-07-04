import {
  CG_IMAGES_LOADED_ENABLED,
  CG_SEND_GALLERIES_TOAST,
  CG_CLEAR_GALLERIES_TOAST,
  CG_HYDRATE_GALLERIES,
  CG_TOGGLE_GALLERY_DELETE,
  CG_DELETE_GALLERY_IMAGES,
  CG_TAG_IMAGE_FOR_DELETION,
  CG_RESET_IMAGES_TAGGED_FOR_DELETION,
  CG_CHANGE_CATEGORY_IMAGE_ORDER,
  CG_CHANGE_GALLERY_IMAGE_ORDER,
  CG_CHANGE_CATEGORY_PREVIEW_IMAGE,
  CG_HIGHLIGHT_GALLERIES_LINK,
  CG_CREATE_CATEGORY_SUCCESS,
  CG_CREATE_CATEGORY_ERROR,
  CG_UPLOAD_GALLERY_IMAGE_SUCCESS,
  CG_UPLOAD_GALLERY_ERROR
} from './action-types';
import filter from 'lodash.filter';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';
import utils from 'utils';

export function clearGalleriesToast() {
  return dispatch => {
    dispatch({
      type: CG_CLEAR_GALLERIES_TOAST
    });
  };
}

export function sendGalleriesToast(toast) {
  return dispatch => {
    dispatch({
      type: CG_SEND_GALLERIES_TOAST,
      payload: toast
    });
  };
}

function parseImages(images) {
  let parsedImages = {};

  forIn(images, (imgs, category) => {
    parsedImages[category] = {};
    // ensure orderBy numbering starts with 1, as deleting images can cause the count to get thrown off
    let imgsOrderBy = 1;

    let imgArry = [];
    forIn(imgs, img => {
      imgArry.push(img);
    });

    forEach(orderBy(imgArry, ['orderBy'], ['asc']), img => {
      parsedImages[category][img.id] = { ...img, orderBy: imgsOrderBy };
      ++imgsOrderBy;
    });

  });

  return parsedImages;
}

export function hydrateCustomerGalleries(data) {
  return (dispatch, getState) => {
    const { auth } = getState();
    const snapshotRaw = data ? data : { categories: {}, images: {} };
    const images = snapshotRaw.images || {};
    let parsedImages = {};

    if (Object.keys(images).length > 0) {
      parsedImages = parseImages(images); // refresh orderby numbering
    }

    const snapshot = { ...snapshotRaw, images: parsedImages };

    dispatch({
      type: CG_HYDRATE_GALLERIES,
      payload: { snapshot, auth }
    });
  };
}

export function seqImagesLoadedEnabled(toggle) {
  return dispatch => {
    dispatch({
      type: CG_IMAGES_LOADED_ENABLED,
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
      type: CG_CREATE_CATEGORY_ERROR
    });
  };
  return (dispatch, getState) => {
    const { firebase, customerGalleries } = getState();
    let categoriesLength = Object.keys(customerGalleries.categories).length;

    if (isValidCategory(category)) {
      const id = firebase.database('customerGalleries').ref().child('categories').push().key;
      firebase.database().ref(`customerGalleries/categories/${id}`).set({
        id,
        category: category.toLowerCase(),
        publicId: utils.uuid(),
        secretId: utils.uuid(),
        orderBy: ++categoriesLength,
        pending: true
      }).then(() => {
        dispatch({
          type: CG_CREATE_CATEGORY_SUCCESS
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

export function toggleGalleryDelete(bool) {
  return (dispatch, getState) => {
    const { customerGalleries } = getState();
    dispatch({
      type: CG_TOGGLE_GALLERY_DELETE,
      payload: typeof bool === 'boolean' ? bool : !customerGalleries.galleryDeleteEnabled
    });
  };
}

export function onGalleryDeleteImages(successCallback) {
  return (dispatch, getState) => {
    const { firebase, customerGalleries } = getState();
    const storage = firebase.storage();
    const database = firebase.database();
    let imagesDeletedCount = 0;
    const taggedForDeleteCount = customerGalleries.taggedForDeleteCount;
    let success = false;

    forIn(customerGalleries.images, gallery => {
      forIn(gallery, image => {
        if (image.shouldDelete) {
          // TODO: for each file that is deleted the meta data must also be removed from firebase
          database.ref(`customerGalleries/images/${image.categoryId}/${image.id}`).set(null).then(() => {
            const storageRef = storage.ref();
            // Create a reference to the file to delete
            const imageRef = storageRef.child(image.fullPath);
            imageRef.delete().then(() => {
              // File deleted successfully
              imagesDeletedCount++;
              // call if all files have been deleted....
              if (imagesDeletedCount === taggedForDeleteCount) {
                success = true;
                successCallback();
                dispatch({
                  type: CG_RESET_IMAGES_TAGGED_FOR_DELETION
                });
              }
            }).catch(() => {
              // we failed to delete an img.....log error
              database.ref(`logs/errors/customerGalleries/shouldDelete/${image.id}`).set(image);
            });
          }).catch(() => {
            dispatch({
              type: CG_SEND_GALLERIES_TOAST,
              payload: {
                firstLine: 'Error!',
                secondLine: `Failed to delete ${image.name}!`,
                type: 'error'
              }
            });
          });
        }
      });
    });

    setTimeout(() => {
      if (!success) {
        dispatch({
          type: CG_RESET_IMAGES_TAGGED_FOR_DELETION
        });
        successCallback('error', 'An attempt to delete images was made, although some files may not have been deleted!');
      } // timeout to run and see if success callback failed, then warn that some imgs may not have been deleted
    }, 7500);

    dispatch({
      type: CG_DELETE_GALLERY_IMAGES
    });
  };
}


export function resetTaggedForGalleryDelete() {
  return dispatch => {
    dispatch({
      type: CG_RESET_IMAGES_TAGGED_FOR_DELETION
    });
  };
}

export function tagImgForDeletion(data) {
  return dispatch => {
    dispatch({
      type: CG_TAG_IMAGE_FOR_DELETION,
      payload: { imageId: data.imageId, categoryId: data.categoryId }
    });
  };
}

export function changeGalleryCategoryOrder(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const database = firebase.database();

    const orderedCategories = orderBy({ ...opts.categories }, ['orderBy'], ['asc']);
    let newOrderedCategories = [];
    let insertedCategory;

    forIn(orderedCategories, category => {
      if (category.id !== opts.categoryId) {
        newOrderedCategories.push(category); // create categorys array without category we are changing position for
      }
      else {
        insertedCategory = category;
      }
    });

    newOrderedCategories.splice(--opts.desiredOrderBy, 0, insertedCategory); // place the insertedImage into the desiredOrderBy position

    let categories = {};

    forEach(newOrderedCategories, (category, key) => {
      categories[category.id] = { ...category, orderBy: ++key }; // create new category object
    });

    // set that data in firebase & reducer should merge the updated gallery with galleries props
    database.ref('customerGalleries/categories').set(categories).then(() => {
      dispatch({
        type: CG_CHANGE_CATEGORY_IMAGE_ORDER,
        payload: { categories }
      });
    }).catch(() => {
      dispatch({
        type: CG_SEND_GALLERIES_TOAST,
        payload: {
          firstLine: 'Error!',
          secondLine: 'Failed to update categories order!',
          type: 'error'
        }
      });
    });
  };
}


export function changeGalleryImageOrder(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const database = firebase.database();

    const orderedGallery = orderBy({ ...opts.gallery }, ['orderBy'], ['asc']);
    let newOrderedGallery = [];
    let insertedImage;

    forIn(orderedGallery, image => {
      if (image.id !== opts.imageId) {
        newOrderedGallery.push(image); // create images array without image we are changing position for
      }
      else {
        insertedImage = image;
      }
    });

    newOrderedGallery.splice(--opts.desiredOrderBy, 0, insertedImage); // place the insertedImage into the desiredOrderBy position

    let gallery = {};

    forEach(newOrderedGallery, (image, key) => {
      gallery[image.id] = { ...image, orderBy: ++key }; // create new gallery object
    });

    const categoryId = gallery[opts.imageId].categoryId;
    // set that data in firebase & reducer should merge the updated gallery with galleries props
    database.ref(`customerGalleries/images/${categoryId}`).set(gallery).then(() => {
      dispatch({
        type: CG_CHANGE_GALLERY_IMAGE_ORDER,
        payload: { gallery, categoryId }
      });
    }).catch(() => {
      dispatch({
        type: CG_SEND_GALLERIES_TOAST,
        payload: {
          firstLine: 'Error!',
          secondLine: 'Failed to update image order!',
          type: 'error'
        }
      });
    });
  };
}

export function changeCategoryPreviewImage(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const database = firebase.database();

    let gallery = {};
    const categoryId = opts.gallery[opts.imageId].categoryId;

    forIn(opts.gallery, image => {
      gallery[image.id] = { ...image, categoryPreviewImage: opts.imageId !== image.id ? false : true };
    });

    database.ref(`customerGalleries/images/${categoryId}`).set(gallery).then(() => {
      dispatch({
        type: CG_CHANGE_CATEGORY_PREVIEW_IMAGE,
        payload: { gallery, categoryId }
      });
    }).catch(() => {
      dispatch({
        type: CG_SEND_GALLERIES_TOAST,
        payload: {
          firstLine: 'Error!',
          secondLine: 'Failed to update category preview image!',
          type: 'error'
        }
      });
    });
  };
}

export function highlightGalleriesLink(toggle) {
  return dispatch => {
    dispatch({
      type: CG_HIGHLIGHT_GALLERIES_LINK,
      payload: toggle
    });
  };
}

export function uploadGalleryZipFile(data) {
  return (dispatch, getState) => {
    const { firebase, customerGalleries } = getState();
    const { files, category, categoryId, unapprovedUploadAlert } = data;
    const zip = customerGalleries.zip[categoryId] || {}; // check for preexisting zip file
    const database = firebase.database();
    const storage = firebase.storage();
    let unapproved = files.length > 1;
    let unapprovedFiles = [];
    let approvedFiles = filter(files, file => {
      // 600k file limit
      if (file.size < 150000000) {
        return file;
      }
      else {
        unapprovedFiles.push(file);
      }
    });
    // if above limit show sweet alert w/ list of images that couldn't be uploaded
    if (unapprovedFiles.length > 0 || unapproved) {
      unapprovedUploadAlert(unapprovedFiles, 'zip');
      return;
    }
    const uploadZipFile = () => {
      forEach(approvedFiles, file => {
        const storageRef = storage.ref().child(file.name);
        const zipRef = storageRef.child(`${categoryId}/zip/${file.name}`);
        const uploadZip = zipRef.put(file);

        uploadZip.on('state_changed', () => {
          // Observe state change events such as progress, pause, and resume
        }, error => {
          dispatch({
            type: CG_UPLOAD_GALLERY_ERROR,
            payload: error
          });
        }, () => {
          // Handle successful uploads on complete
          const id = firebase.database('customerGalleries/zip').ref().child(`${categoryId}`).push().key;
          const src = uploadZip.snapshot.downloadURL;
          const zipMeta = uploadZip.snapshot.metadata;
          const { contentType, downloadURLs, fullPath, name, size, timeCreated } = zipMeta;
          // get last image and increment orderby count
          const zipData = { id, src, category, categoryId, contentType, downloadURLs, fullPath, name, size, timeCreated };

          database.ref(`customerGalleries/zip/${categoryId}`).set(zipData); // set meta data
        });
      });
    };
    if (!zip.id) {
      uploadZipFile();
    }
    else { // delete existing zip file then upload the new on if its approved
      database.ref(`customerGalleries/zip/${categoryId}`).set(null).then(() => {
        const storageRef = storage.ref();
        // Create a reference to the file to delete
        const zipRef = storageRef.child(zip.fullPath);
        zipRef.delete().then(() => {
          // File deleted successfully
          uploadZipFile(); // upload new file
        });
      });
    }
  };
}

export function pushImageData(dispatch, firebase, imageData, shouldDispatch) {
  const database = firebase.database();
  database.ref(`customerGalleries/images/${imageData.categoryId}/${imageData.id}`).set(imageData).then(() => {
    if (shouldDispatch) {
      dispatch({
        type: CG_UPLOAD_GALLERY_IMAGE_SUCCESS
      });
    }
  });
}

export function uploadGalleryImage(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    const { files, category, categoryId, unapprovedUploadAlert } = data;
    const storage = firebase.storage();
    let shouldDispatch = false;
    const filesLength = data.files.length - 1;
    const orderedGallery = orderBy({ ...data.gallery }, ['orderBy'], ['asc']);
    const hasImgs = orderedGallery.length > 0;
    let lastImgOrderBy = hasImgs ? orderedGallery[orderedGallery.length - 1].orderBy : 0; // get orderbyStart #
    let unapprovedFiles = [];
    let approvedFiles = filter(files, file => {
      // 600k file limit
      if (file.size < 600000) {
        return file;
      }
      else {
        unapprovedFiles.push(file);
      }
    });
    // if above limit show sweet alert w/ list of images that couldn't be uploaded
    if (unapprovedFiles.length > 0) {
      unapprovedUploadAlert(unapprovedFiles);
    }

    forEach(approvedFiles, (file, key) => {
      const storageRef = storage.ref().child(file.name);
      const imageRef = storageRef.child(`${categoryId}/${file.name}`);
      const uploadImage = imageRef.put(file);

      uploadImage.on('state_changed', () => {
        // Observe state change events such as progress, pause, and resume
      }, error => {
        dispatch({
          type: CG_UPLOAD_GALLERY_ERROR,
          payload: error
        });
      }, () => {
        // Handle successful uploads on complete
        const id = firebase.database('customerGalleries/images').ref().child(`${categoryId}`).push().key;
        const src = uploadImage.snapshot.downloadURL;
        const imageMeta = uploadImage.snapshot.metadata;
        const { contentType, downloadURLs, fullPath, name, size, timeCreated } = imageMeta;
        const categoryPreviewImage = !hasImgs && key === 0 ? true : false; // set to true if no images exist in the gallery category
        const orderBy = ++lastImgOrderBy;
        // get last image and increment orderby count
        const imageData = { id, src, category, categoryId, orderBy, categoryPreviewImage, contentType, downloadURLs, fullPath, name, size, timeCreated, pending: true };

        if (filesLength === key) { // dispatch success message after last image is successfully uploaded
          shouldDispatch = true;
        }

        pushImageData(dispatch, firebase, imageData, shouldDispatch); // add imageData to db & dispatch success event
      });
    });

  };
}
