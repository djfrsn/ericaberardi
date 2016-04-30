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

    firebase.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      if (error) {
        dispatch({
          type: SIGN_IN_ERROR,
          payload: error,
          meta: {
            timestamp: Date.now()
          }
        });
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
      payload: firebase.getAuth(),
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
  console.log('signOut');
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.unauth();
    dispatch({
      type: SIGN_OUT_SUCCESS
    });
  };
}
