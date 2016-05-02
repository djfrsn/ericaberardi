import {
  LOAD_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CREATE_TASK_ERROR,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  UPDATE_TASK_SUCCESS
} from './action-types';
import Firebase from 'firebase';
import { FIREBASE_URL } from '../../config';

const loadPendingUpdates = dispatch => {
  let pendingAdminChanges = new Firebase(`${FIREBASE_URL}/pendingAdminChanges`);
  pendingAdminChanges.on('value', snapshot => {
    dispatch({
      type: LOAD_PENDING_UPDATES,
      payload: snapshot.val()
    });
  });
};

export function initAdmin() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    if (firebase.getAuth()) {
      loadPendingUpdates(dispatch);
    }
  };
}

export function loadPendingAdminUpdates() {
  return dispatch => {
    loadPendingUpdates(dispatch);
  };
}

const childUrl = update => { return update.name === 'homeGalleryOne' || update.name === 'homeGalleryTwo' ? update.name : `${update.name}/${updateComputed.id}`; };

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
      const url = childUrl(update);
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

export function deletePublishUpdates(update) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.child(`pendingAdminChanges/${childUrl(update)}`)
      .remove(error => {
        if (error) {
          console.error('ERROR @ deleteTask :', error); // eslint-disable-line no-console
          dispatch({
            type: DELETE_TASK_ERROR,
            payload: error
          });
        }
      });
  };
}

export function createTask(title) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();

    firebase.child(`tasks/${auth.id}`)
      .push({completed: false, title}, error => {
        if (error) {
          console.error('ERROR @ createTask :', error); // eslint-disable-line no-console
          dispatch({
            type: CREATE_TASK_ERROR,
            payload: error
          });
        }
      });
  };
}


export function deleteTask(task) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();

    firebase.child(`tasks/${auth.id}/${task.key}`)
      .remove(error => {
        if (error) {
          console.error('ERROR @ deleteTask :', error); // eslint-disable-line no-console
          dispatch({
            type: DELETE_TASK_ERROR,
            payload: error
          });
        }
      });
  };
}


export function undeleteTask() {
  return (dispatch, getState) => {
    const { auth, firebase, tasks } = getState();
    const task = tasks.deleted;

    firebase.child(`tasks/${auth.id}/${task.key}`)
      .set({completed: task.completed, title: task.title}, error => {
        if (error) {
          console.error('ERROR @ undeleteTask :', error); // eslint-disable-line no-console
        }
      });
  };
}


export function updateTask(task, changes) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();

    firebase.child(`tasks/${auth.id}/${task.key}`)
      .update(changes, error => {
        if (error) {
          console.error('ERROR @ updateTask :', error); // eslint-disable-line no-console
          dispatch({
            type: UPDATE_TASK_ERROR,
            payload: error
          });
        }
      });
  };
}


export function registerListeners() {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    const ref = firebase.child(`tasks/${auth.id}`);

    ref.on('child_added', snapshot => dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: recordFromSnapshot(snapshot)
    }));

    ref.on('child_changed', snapshot => dispatch({
      type: UPDATE_TASK_SUCCESS,
      payload: recordFromSnapshot(snapshot)
    }));

    ref.on('child_removed', snapshot => dispatch({
      type: DELETE_TASK_SUCCESS,
      payload: recordFromSnapshot(snapshot)
    }));
  };
}


function recordFromSnapshot(snapshot) {
  let record = snapshot.val();
  record.key = snapshot.key();
  return record;
}
