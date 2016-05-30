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
import filter from 'lodash.filter';
import utils from 'utils';

export function clearAdminToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_ADMIN_TOAST
    });
  };
}

function getPendingUpdatesCount(pendingUpdates) {
  let pendingUpdatesCount = 0;

  forIn(pendingUpdates, updates => {
    forIn(updates, update => {
      pendingUpdatesCount += update.length;
    });
  });
  // `console.log('pendingUpdatesCount', pendingUpdatesCount);
  return pendingUpdatesCount;
}

// Updates are set based on routes in this shape { galleries: data, about: data, contact: data }
// each key/value pair contains all pending updates for each route
function dispatchPendingUpdates(dispatch, category, admin, pendingData) {
  let pendingUpdates = { ...admin.pendingUpdates };

  pendingUpdates[category] = {}; // pending updates to be set here

  forIn(pendingData, (prop, key) => {
    const pendingProp = filter(prop, ['pending', true]);

    if (pendingProp.length > 0) {
      pendingUpdates[category][key] = pendingProp; // update new pendingProp
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
function setPendingStatus(status, pendingState) {
  let newPendingState = {};

  // works for objects with children that are objectArrays only
  forIn(pendingState, (subCategories, subCategory) => {
    newPendingState[subCategory] = [];
    forIn(subCategories, data => {
      newPendingState[subCategory].push({...data, pending: false});
    });
  });

  return newPendingState;
}

// Minimums for how many categorys/children should exist in the db
function getPendingChangeMinimums(category) {
  let minCategoryCount = 1;
  let minChildCount = 1;

  switch (category) {
    case 'galleries':
      minCategoryCount = 5;
      minChildCount = 4;
      break;

    default:
  }

  return { minCategoryCount, minChildCount };
}

// Return true if pendingUpdate children meet minimum content count i.e there should always be atleast 5 gallery categories w/ atleast 8 photos each
// This will prevent a user from deleting all of the content from the site :)
function validatePendingChanges(category, pendingState) {
  const { minCategoryCount, minChildCount } = getPendingChangeMinimums(category);
  let validChanges = false;
  // works work object arrays
  const categoryCount = Object.keys(pendingState).length;
  if (categoryCount >= minCategoryCount) {
    let pendingStateValid = true;

    forIn(pendingState, child => {
      if (child.length < minChildCount) {
        pendingStateValid = false;
      }
    });
    validChanges = pendingStateValid;
  }

  return validChanges;
}

// This method should work for any category
function publishContent(dispatch, getState, category, pendingState, publishCallback) {
  const { firebase } = getState();
  const changesValidated = validatePendingChanges(category, pendingState);

  if (changesValidated) {
    const newState = setPendingStatus(false, pendingState); // set pending status of all children to false
    const database = firebase.database();
    database.ref(`${ENV}/${category}`).set(newState).then(() => {
      database.ref(`${ENV}/pendingUpdates/${category}`).remove();
      if (utils.isFunction(publishCallback)) {
        publishCallback();
      }
    }).catch(error => {
      dispatch({
        type: PUBLISH_ERROR,
        payload: error
      });
    });
  }
  else {
    dispatch({
      type: PUBLISH_INAVLID
    });
  }
}

export function publishPendingUpdates(successCallback) {
  return (dispatch, getState) => {
    const { admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesLength = Object.keys(pendingUpdates).length;
    let publishCallback;
    let callbackCount = 1;
    // loop through pendingUpdates & set state to firebase
    forIn(pendingUpdates, (update, category) => {
      // each route has it's own state and pending- state to hold data with user edits
      let pendingState = { ...getState()[category][`pending-${category}`] }; // get the pending state for a given category

      if (pendingUpdatesLength === callbackCount) { // pass publishCallback for final pass on pendingUpdates
        publishCallback = successCallback;
        dispatch({
          type: CLEAR_PENDING_UPDATES
        });
      }

      switch (category) {
        case 'galleries':
          publishContent(dispatch, getState, category, pendingState, publishCallback);
          break;

        default:
      }

      callbackCount++;
    });
  };
}

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
