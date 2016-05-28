import {
  CLEAR_TOAST,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CLEAR_UPDATES_ERROR
} from './action-types';

export function clearToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_TOAST
    });
  };
}

// export function initAdmin() {
//   return (dispatch, getState) => {
//     const { firebase } = getState();
//     if (firebase.auth().currentUser) {
//
//     }
//   };
// }

const childUrl = (update, updateComputed) => { return update.name === 'homeGalleryOne' || update.name === 'homeGalleryTwo' ? update.name : `${update.name}/${updateComputed.id}`; };

export function publishUpdates() {
  return (dispatch, getState) => {
    const { firebase, admin, galleries } = getState();
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
