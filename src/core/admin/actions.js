import {
  CLEAR_TOAST,
  SET_PENDING_UPDATES_COUNT,
  SET_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CLEAR_UPDATES_ERROR
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

  return pendingUpdatesCount;
}

// Updates are set based on routes in this shape { galleries: data, about: data, contact: data }
// each key/value pair contains all pending updates for each route
function dispatchPendingUpdates(dispatch, childUrl, admin, pendingData) {
  let pendingUpdates = { ...admin.pendingUpdates };

  pendingUpdates[childUrl] = {}; // pending updates to be set here

  forIn(pendingData, (prop, key) => {
    var pendingProp = filter(prop, ['pending', true]);
    if (pendingProp.length > 0) {
      pendingUpdates[childUrl][key] = pendingProp; // update new pendingProp
    }
  });

  const pendingUpdatesCount = getPendingUpdatesCount(pendingUpdates);

  dispatch({
    type: SET_PENDING_UPDATES,
    payload: { pendingUpdates, pendingUpdatesCount }
  });
}

export function setPendingUpdates(childUrl, pendingGalleries) {
  return (dispatch, getState) => {
    const { admin } = getState();
    switch (childUrl) {
      case 'galleries':
        dispatchPendingUpdates(dispatch, childUrl, admin, pendingGalleries);
        break;

      default:
    }
  };
}

function publishGalleriesUpdates(getState, dispatch, childUrl) {
  // TODO: set all pending galleries to pending false
  const { firebase, admin, galleries } = getState();
  debugger // check if pending changes actuall exist to protect unecessary publishing
  const database = firebase.database();
  database.ref(`${ENV}/${childUrl}`).set(galleries.pendingGalleries).then(() => {
    dispatch({
      type: PUBLISH_SUCCESS
    });
    database.ref(`${ENV}/pendingUpdates/${childUrl}`).remove();
  }).catch(error => {
    dispatch({
      type: PUBLISH_ERROR,
      payload: error
    });
  });
}

export function publishUpdates() {
  return (dispatch, getState) => {
    const { admin } = getState();

    forIn(admin.pendingUpdates, (update, childUrl) => {
    // loop through each pending update & set appropriate state to firebase
      switch (childUrl) {
        case 'galleries':
          publishGalleriesUpdates(getState, dispatch, childUrl);
          break;

        default:
      }
    });
  };
}

const deleteAdminChanges = (firebase, update, dispatch) => {
  firebase.child(`pendingAdminChanges/${''}`)
    .remove(error => {
      if (error) {
        console.error('ERROR @ deleteTask :', error); // eslint-disable-line no-console
        dispatch({
          type: CLEAR_UPDATES_ERROR,
          payload: error
        });
      }
    });
};

export function clearPublishUpdates() {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    if (admin.pendingUpdates.length >= 1) {
      admin.pendingUpdates.forEach(update => {
        deleteAdminChanges(firebase, update, dispatch);
      });
    }
  };
}

export function deletePublishUpdates(update) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    deleteAdminChanges(firebase, update, dispatch);
  };
}
