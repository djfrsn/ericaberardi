import {
  CLEAR_TOAST,
  SET_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CLEAR_UPDATES_ERROR
} from './action-types';
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
  console.log('pendingUpdateCount', pendingUpdatesCount);
  return pendingUpdatesCount;
}

// Updates are set based on routes in this shape { galleries: data, about: data, contact: data }
// each key/value pair contains all pending updates for each route
function dispatchPendingUpdates(dispatch, childUrl, props, pendingData) {
  let pendingUpdates = { ...props.admin.pendingUpdates };

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

export function setPendingUpdates(childUrl, props) {
  return dispatch => {
    switch (childUrl) {
      case 'galleries':
        dispatchPendingUpdates(dispatch, childUrl, props, props.galleries.mergedGalleries);
        break;

      default:
    }
  };
}

const childUrl = (update, updateComputed) => { return update.name === 'homeGalleryOne' || update.name === 'homeGalleryTwo' ? update.name : `${update.name}/${updateComputed.id}`; };

export function publishUpdates() {
  return (dispatch, getState) => {
    const { firebase, admin, galleries } = getState();
    debugger
    admin.pendingUpdates.forEach(update => {
      const updateComputed = update.data[Object.keys(update.data)[0]];
      let data = galleries[update.name].map(gal => {
        return {
          ...gal,
          src: updateComputed.id === gal.id ? updateComputed.src : gal.src,
          topText: updateComputed.id === gal.id ? updateComputed.topText : gal.topText,
          bottomText: updateComputed.id === gal.id ? updateComputed.bottomText : gal.bottomText
        };
      });
      const url = childUrl(update, updateComputed);
      firebase.child(url)
        .set(data, error => {
          if (error) {
            console.error('ERROR @ createTask :', error); // eslint-disable-line no-console
            dispatch({
              type: PUBLISH_ERROR,
              payload: error
            });
          }
          else {
            dispatch({
              type: PUBLISH_SUCCESS,
              payload: update
            });
          }
        });
    });
  };
}

const deleteAdminChanges = (firebase, update, dispatch) => {
  firebase.child(`pendingAdminChanges/${childUrl(update, {})}`)
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
