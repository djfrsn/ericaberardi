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
    var pendingProp = filter(prop, ['pending', true]);
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

function setPendingStatus(status, getState, category) {
  debugger
}

function hasPendingChanges(getState, category) {
  debugger

  return false;
}

function publishGalleriesUpdates(getState, dispatch, category) {
  const { firebase, galleries } = getState();
  // TODO: set all pending galleries to pending false
  setPendingStatus(false, getState, category);
  // TODO: check if pending changes actuall exist to protect unecessary publishing
  const changesPending = hasPendingChanges(getState, category);
  if (changesPending) {
    const database = firebase.database();
    database.ref(`${ENV}/${category}`).set(galleries[`pending-${category}`]).then(() => {
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
    // loop through each pending update & set appropriate state to firebase
      switch (category) {
        case 'galleries':
          publishGalleriesUpdates(getState, dispatch, category);
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
