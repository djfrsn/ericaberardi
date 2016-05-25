import {
  INIT_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_OUT_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  RESET_AUTH_MESSAGES
} from './action-types';


export function resetAuthMessages(timeout = 1250) {
  return dispatch => {
    setTimeout(() => {
      dispatch({
        type: RESET_AUTH_MESSAGES
      });
    }, timeout);
  };
}

function authenticate(provider) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    firebase.authWithOAuthPopup(provider, (error, authData) => {
      if (error) {
        console.error('ERROR @ authWithOAuthPopup :', error); // eslint-disable-line no-console
      }
      else {
        dispatch({
          type: SIGN_IN_SUCCESS,
          payload: authData,
          meta: {
            timestamp: Date.now()
          }
        });
      }
    });
  };
}

export function signInWithEmail(email, password) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    firebase.auth().signInWithEmailAndPassword(email, password).then(authData => {
      dispatch({
        type: SIGN_IN_SUCCESS,
        payload: authData,
        meta: {
          timestamp: Date.now()
        }
      });
    }).catch(function(error) {
      dispatch({
        type: SIGN_IN_ERROR,
        payload: error,
        meta: {
          timestamp: Date.now()
        }
      });
    });
  };
}

export function changePassword(oldPassword, newPassword) {
  return (dispatch, getState) => {
    const { firebase, auth } = getState();

    firebase.changePassword({
      email: auth.userEmail,
      oldPassword: oldPassword,
      newPassword: newPassword
    }, function(error, res) {
      if (error === null) {
        dispatch({
          type: CHANGE_PASSWORD_ERROR,
          payload: error,
          meta: {
            timestamp: Date.now()
          }
        });
      }
      else {
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          payload: res,
          meta: {
            timestamp: Date.now()
          }
        });
      }
    });
  };
}

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    dispatch({
      type: INIT_AUTH,
      payload: firebase.auth().currentUser,
      meta: {
        timestamp: Date.now()
      }
    });
  };
}


export function signInWithGithub() {
  return authenticate('github');
}


export function signInWithGoogle() {
  return authenticate('google');
}


export function signInWithTwitter() {
  return authenticate('twitter');
}


export function signOut() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      dispatch({
        type: SIGN_OUT_SUCCESS
      });
    });
  };
}
