import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES,
  CLEAR_UPDATES_ERROR
} from './action-types';
import { ENV } from 'config';
import forIn from 'lodash.forin';
import findKey from 'lodash.findkey';
import utils from 'utils';

export function clearAdminToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_ADMIN_TOAST
    });
  };
}

export function deleteGalleries(opts) {
  return (dispatch, getState) => {
    const { firebase, galleries } = getState();
    const database = firebase.database();
    const categoryName = opts.category.toLowerCase();
    const categoryId = findKey(galleries.categories, { category: categoryName });
    let callbackCount = 0;

    const successCallback = () => {
      if (callbackCount > 1) {
        opts.deleteSuccessAlert(categoryName);
      }
    };

    if (categoryId) {
      database.ref(`${ENV}/galleries/categories/${categoryId}`).set(null).then(() => {
        callbackCount++;
        successCallback();
      }).catch(() => {
        opts.deleteErrorAlert();
      });
      database.ref(`${ENV}/galleries/images/${categoryId}`).set(null).then(() => {
        callbackCount++;
        successCallback();
      }).catch(error => {
        // we failed to delete a categories images.....log error
        database.ref(`${ENV}/logs/errors/galleries/shouldDelete/${categoryId}`).set({functionName: 'deleteGalleries', 'info': `This was a failure for deleting the following data: ${ENV}/galleries/images/${categoryId}`, error});
      });
    }
    else {
      opts.sweetalert.showInputError('This isn\"t a valid category name!');
    }
  };
}

// helper for obtaining pendingImages
function isImages(category, key) {
  return category === 'galleries' && key === 'images';
}

export function getPendingImagesCount(categories) {
  let pendingImagesCount = 0;

  forIn(categories, images => {
    pendingImagesCount += Object.keys(images).length;
  });

  return pendingImagesCount;
}

function getPendingUpdatesCount(pendingUpdates) {
  let pendingUpdatesCount = 0;

  forIn(pendingUpdates, (updates, category) => {
    forIn(updates, (update, key) => {
      if (isImages(category, key)) {
        pendingUpdatesCount += getPendingImagesCount(update, key);
      }
      else {
        pendingUpdatesCount += Object.keys(update).length;
      }
    });
  });
  // `console.log('pendingUpdatesCount', pendingUpdatesCount);
  return pendingUpdatesCount;
}

function getPendingImages(categories) {
  let pendingImages = {};

  forIn(categories, (images, key) => {
    if (Object.keys(images).length > 0) {
      pendingImages[key] = {}; // do images have keys? A category with no images wouldn't....
    }
    forIn(images, (image, id) => {
      if (image.pending) {
        pendingImages[key][id] = image;
      }
    });
  });

  return pendingImages;
}

// Updates are set based on routes in this shape { galleries: data, about: data, contact: data }
// each key/value pair contains all pending updates for each route
function dispatchPendingUpdates(dispatch, category, admin, snapshot) {
  let pendingUpdates = { ...admin.pendingUpdates }; // apply current pending updates

  if (Object.keys(snapshot).length > 0) { // register pending updates if any exist
    pendingUpdates[category] = {}; // reset pending updates for a category
    if (category === 'galleries') {
      forIn(snapshot, (prop, key) => {

        let pendingProp = {};
        forIn(prop, (child, key) => {
          if (child.pending) {
            pendingProp[key] = child;
          }
        });

        const parentPending = Object.keys(pendingProp).length > 0;
        if (parentPending) {
          pendingUpdates[category][key] = pendingProp; // update new pendingProp
        }
        else if (isImages(category, key)) { // images are nested differently than categories....
          const pendingImages = getPendingImages(prop);
          let hasPendingImages = false;
          forIn(pendingImages, images => {
            if (Object.keys(images).length > 0) {
              hasPendingImages = true;
            }
          });
          if (hasPendingImages) {
            pendingUpdates[category][key] = getPendingImages(prop); // a special function is needed to extract pending images
          }
        }
      });
    }
  }

  const pendingUpdatesCount = getPendingUpdatesCount(pendingUpdates);
  // show available pending updates
  if (pendingUpdatesCount > 0) {
    dispatch({
      type: SET_PENDING_UPDATES,
      payload: { pendingUpdates, pendingUpdatesCount }
    });
  }
}

// a category is based on a childUrl for the app routes i.e /about
export function setPendingUpdates(category, snapshot) {
  return (dispatch, getState) => {
    const { admin } = getState();
    if (snapshot) {
      switch (category) {
        case 'galleries':
          dispatchPendingUpdates(dispatch, category, admin, snapshot);
          break;

        default:
      }
    }
  };
}

// Set 'pending: false' for each child of a given pendingUpdate category
function setPendingStatus(category, status, state) {
  let newPendingState = { ...state };

  if (category === 'galleries') {
    newPendingState.images = { ...state.images }; // extend to avoid losing data other than objects
    forIn(state.categories, category => {
      const categoryId = category.id;
      newPendingState.categories[categoryId] = { ...category, pending: false };
      const images = state.images[categoryId];
      if (images) {
        forIn(images, image => {
          newPendingState.images[categoryId][image.id] = {...image, pending: false};
        });
      }
    });
  }

  return newPendingState;
}

// Minimums for how many categorys/children should exist in the db
function getPendingChangeMinimums(category) {
  let minCategoryCount = 1;
  let minChildCount = 1;

  switch (category) {
    case 'galleries':
      minCategoryCount = 3;
      minChildCount = 4;
      break;

    default:
  }

  return { minCategoryCount, minChildCount };
}

// Return true if pendingUpdate children meet minimum content count i.e there should always be atleast 5 gallery categories w/ atleast 8 photos each
// This will prevent a user from deleting all of the content from the site :)
function validatePendingChanges(category, state) {
  const { minCategoryCount, minChildCount } = getPendingChangeMinimums(category);
  let validChanges = false;

  if (category === 'galleries') {
    const categories = state.categories;
    const categoryCount = Object.keys(categories).length;
    if (categoryCount >= minCategoryCount) {
      let stateValid = true;
      let index = 1;

      forIn(categories, category => {
        const images = state.images[category.id] || {};
        if (Object.keys(images).length < minChildCount && index <= minCategoryCount) {
          stateValid = false;
        }
        index++;
      });
      validChanges = stateValid;
    }
  }

  return validChanges;
}

// This method should work for any category
function publishContent(opts) {
  const { firebase } = opts.getState();
  const changesValidated = validatePendingChanges(opts.category, opts.state);

  if (changesValidated) {
    const newState = setPendingStatus(opts.category, false, opts.state); // set pending status of all children to false
    const database = firebase.database();
    let callbackCount = 1;
    let successCallback;

    opts.children.forEach(child => {
      // iterate through category children & set data in firebase
      if (opts.children.length === callbackCount) {
        successCallback = opts.callbacks.successCallback;
      }

      database.ref(`${ENV}/${opts.category}/${child}`).set(newState[child]).then(() => {
        opts.dispatch({
          type: CLEAR_PENDING_UPDATES
        });
        if (utils.isFunction(successCallback)) {
          setTimeout(() => {
            successCallback(); // call final publish/success callback
          }, 0);
        }
        callbackCount++;
      });
    });
  }
  else {
    setTimeout(() => {
      if (utils.isFunction(opts.callbacks.errorCallback)) {
        opts.callbacks.errorCallback(); // show error alert
      }
    }, 0); // run at the end of the callstack to avoid sweetalert glitch
  }
}

export function publishPendingUpdates(successCallback, errorCallback) {
  return (dispatch, getState) => {
    const { admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesLength = Object.keys(pendingUpdates).length;
    let callbacks = {errorCallback};
    let callbackCount = 1;

    // loop through pendingUpdates & set state to firebase
    forIn(pendingUpdates, (update, category) => {
      // each route has it's own state and pending- state to hold data with user edits
      let state = { ...getState()[category] }; // get the pending state for a given category

      if (pendingUpdatesLength === callbackCount) { // pass publishCallback for final pass on pendingUpdates
        callbacks.successCallback = successCallback;
      }

      switch (category) {
        case 'galleries':
          publishContent({dispatch, getState, category, children: ['categories', 'images'], state, callbacks});
          break;

        default:
      }

      callbackCount++;
    });
  };
}

function clearPendingUpdates(dispatch) {
  dispatch({
    type: CLEAR_PENDING_UPDATES
  });
}

function removePendingGalleriesData(opts) {
  const data = opts.data;
  const database = opts.firebase.database();
  const storage = opts.firebase.storage();
  let callbackCount = 1;
  // delete meta & delete img
  forIn(data, (data, subCategory) => {

    if (subCategory === 'categories') {
      // delete categories data
      forIn(data, category => {
        database.ref(`${ENV}/galleries/categories/${category.id}`).set(null).then(() => {
          if (opts.pendingUpdatesCount === callbackCount) {
            clearPendingUpdates(opts.dispatch);
            if (utils.isFunction(opts.successCallback)) {
              opts.successCallback(); // call final publish/success callback
            }
          }
          callbackCount++;
        }).catch(error => {
          database.ref(`${ENV}/logs/errors/galleries/shouldDelete/${category.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${ENV}/galleries/categories/${category.id}`, error});
        });
      });
    }

    if (subCategory === 'images') {
      forIn(data, images => {
        if (Object.keys(images).length > 0) {
          forIn(images, image => {
            database.ref(`${ENV}/galleries/images/${image.categoryId}/${image.id}`).set(null).then(() => {
              if (opts.pendingUpdatesCount === callbackCount) {
                clearPendingUpdates(opts.dispatch);
                if (utils.isFunction(opts.successCallback)) {
                  opts.successCallback(); // call final publish/success callback
                }
              }
              callbackCount++;
            }).catch(error => {
              database.ref(`${ENV}/logs/errors/galleries/shouldDelete/${image.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${ENV}/galleries/images/${image.categoryId}/${image.id}`, error});
            });
            storage.ref().child(image.fullPath).delete().catch(error => {
              database.ref(`${ENV}/logs/errors/galleries/shouldDelete/images/${image.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${image.fullPath}`, error});
            });
          });
        }
      });
    }

  });
}

// strategy
// check pending content by category & create new state without this data
export function removePendingUpdates(successCallback) {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesCount = admin.pendingUpdatesCount;
    if (Object.keys(pendingUpdates).length >= 1) {
      forIn(pendingUpdates, (data, category) => {
        if (category === 'galleries') {
          // delete pending categories, images & meta
          removePendingGalleriesData({firebase, data, dispatch, pendingUpdatesCount, successCallback});
        }
      });
    }
  };
}
