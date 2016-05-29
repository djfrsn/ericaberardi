import {
  CLEAR_TOAST,
  SET_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR
} from './action-types';
import { ENV } from 'config';
import forIn from 'lodash.forin';
import filter from 'lodash.filter';

export function clearToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_TOAST
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
  console.log('pendingUpdatesCount', pendingUpdatesCount);
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

export function setPendingUpdates(category, pendingGalleries) {
  return (dispatch, getState) => {
    const { admin } = getState();
    switch (category) {
      case 'galleries':
        dispatchPendingUpdates(dispatch, category, admin, pendingGalleries);
        break;

      default:
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

// Return true if we pendingUpdate children exist with 'pending: true'
function hasPendingChanges(pendingState) {
  let pendingChanges = false;

  // works for objects with children that are objectArrays only
  forIn(pendingState, subCategories => {
    if (!pendingChanges) { // perf check to avoid executing after a single pending change is found
      const pendingCategory = filter(subCategories, ['pending', true]);
      if (pendingCategory.length > 0) {
        pendingChanges = true;
      }
    }
  });

  return pendingChanges;
}

function publishGalleriesUpdates(dispatch, getState, category, pendingState) {
  const { firebase } = getState();
  const changesPending = hasPendingChanges(pendingState);

  if (changesPending) {
    const newState = setPendingStatus(false, pendingState);
    const database = firebase.database();
    database.ref(`${ENV}/${category}`).set(newState).then(() => {
      dispatch({
        type: PUBLISH_SUCCESS
      });
      database.ref(`${ENV}/pendingUpdates/${category}`).remove();
    }).catch(error => {
      dispatch({
        type: PUBLISH_ERROR,
        payload: error
      });
    });
  }
}

export function publishPendingUpdates() {
  return (dispatch, getState) => {
    const { admin } = getState();

    forIn(admin.pendingUpdates, (update, category) => {
      let pendingState = { ...getState()[category][`pending-${category}`] };
      // loop through each pending update & set appropriate state to firebase
      switch (category) {
        case 'galleries':
          publishGalleriesUpdates(dispatch, getState, category, pendingState);
          break;

        default:
      }
    });
  };
}

export function undoPendingUpdates() {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    if (Object.keys(admin.pendingUpdates).length >= 1) {
      const database = firebase.database();
      database.ref(`${ENV}/pendingUpdates`).remove();
    }
  };
}
