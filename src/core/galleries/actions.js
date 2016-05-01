import {
  INIT_HOME_GALLERY_ONE,
  INIT_HOME_GALLERY_TWO,
  CLEAR_TOAST,
  INIT_GALLERIES,
  TOGGLE_GALLERY_EDIT,
  SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
  SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  UPDATE_TASK_SUCCESS
} from './action-types';

export function clearToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_TOAST
    });
  };
}

export function initHomeGalleryOne(data) {
  return dispatch => {
    dispatch({
      type: INIT_HOME_GALLERY_ONE,
      payload: data
    });
  };
}

export function initHomeGalleryTwo(data) {
  return dispatch => {
    dispatch({
      type: INIT_HOME_GALLERY_TWO,
      payload: data
    });
  };
}

export function initGalleries(data) {
  return dispatch => {
    dispatch({
      type: INIT_GALLERIES,
      payload: data
    });
  };
}

export function toggleGalleryEdit(data) {
  return dispatch => {
    dispatch({
      type: TOGGLE_GALLERY_EDIT,
      payload: data
    });
  };
}

export function submitGalleryImageUpdates(data) {
  return (dispatch, getState) => {
    const { firebase, galleries } = getState();
    let imageData = {};
    galleries[data.galleryindex].forEach((gallery, index) => {
      const match = data.id === index;
      imageData = {
        ...gallery,
        src: match && data.newImageUrl ? data.newImageUrl : gallery.src,
        bottomText: match && data.newImageBottomText ? data.newImageBottomText : gallery.src,
        topText: match && data.newImageTopText ? data.newImageTopText : gallery.src
      };
    });
    firebase.child(`pendingAdminChanges/${data.galleryindex}/${data.id}`)
      .set(imageData, (error, res) => {
        if (error) {
          console.error('ERROR @ submitGalleryImageUrl :', error); // eslint-disable-line no-console
          dispatch({
            type: SUBMIT_GALLERY_IMAGE_UPDATE_ERROR,
            payload: error
          });
        }
        else {
          dispatch({
            type: SUBMIT_GALLERY_IMAGE_UPDATE_SUCCESS,
            payload: res
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
