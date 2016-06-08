import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES,
  PUBLISH_ERROR,
  PUBLISH_INAVLID,
  CLEAR_UPDATES_ERROR
} from './action-types';
import { ENV } from 'config';
import forIn from 'lodash.forin';
import utils from 'utils';

export function clearAdminToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_ADMIN_TOAST
    });
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
function dispatchPendingUpdates(dispatch, category, admin, pendingData) {
  let pendingUpdates = { ...admin.pendingUpdates }; // apply current pending updates

  pendingUpdates[category] = {}; // reset pending updates for a category

  forIn(pendingData, (prop, key) => {

    let pendingProp = {};
    forIn(prop, (child, key) => {
      if (child.pending) {
        pendingProp[key] = child;
      }
    });

    if (Object.keys(pendingProp).length > 0) {
      pendingUpdates[category][key] = pendingProp; // update new pendingProp
    }
    else if (isImages(category, key)) { // images are nested differently than categories....
      pendingUpdates[category][key] = getPendingImages(prop); // a special function is needed to extract pending images
    }
  });

  const pendingUpdatesCount = getPendingUpdatesCount(pendingUpdates);

  dispatch({
    type: SET_PENDING_UPDATES,
    payload: { pendingUpdates, pendingUpdatesCount }
  });
}

// a category is based on a childUrl for the app routes i.e /about
export function setPendingUpdates(category, snapshot) {
  return (dispatch, getState) => {
    const { admin } = getState();
    if (snapshot) { // snapshot returns 'null' sans data
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
  console.log('validChanges', validChanges);
  return false;
}

// This method should work for any category
function publishContent(opts) {
  const { firebase } = opts.getState();
  const changesValidated = validatePendingChanges(opts.category, opts.state);

  // TODO: try adding more content to meet requirments & see if this works!

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
        if (utils.isFunction(successCallback)) {
          successCallback(); // call final publish/success callback
        }
        callbackCount++;
      });
    });
  }
  else {
    setTimeout(() => {
      if (utils.isFunction(opts.callbacks.errorCallback)) {
        opts.callbacks.errorCallback();
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
// strategy
// check pending content by category & create new state without this data
export function removePendingUpdates(successCallback) {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    if (Object.keys(admin.pendingUpdates).length >= 1) {
      const database = firebase.database();
      database.ref(`${ENV}/pendingUpdates`).set(null).then(() => {
        dispatch({
          type: CLEAR_PENDING_UPDATES
        });
        if (utils.isFunction(successCallback)) {
          successCallback(); // TODO: break utils into named functions
        }
      }).catch(error => {
        dispatch({
          type: CLEAR_UPDATES_ERROR,
          payload: error
        });
      });
    }
  };
}
