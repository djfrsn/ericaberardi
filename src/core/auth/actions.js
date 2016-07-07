import {
  CUSTOMER_SIGN_IN_SUCCESS,
  HYDRATE_AUTH,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR,
  SIGN_OUT_SUCCESS,
  RESET_AUTH_MESSAGES
} from './action-types';
import findKey from 'lodash.findkey';
import delay from 'lodash.delay';
import { POST_LOGIN_PATH, POST_LOGOUT_PATH } from 'config';

export function hydrateAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    dispatch({
      type: HYDRATE_AUTH,
      payload: firebase.auth().currentUser,
      meta: {
        timestamp: Date.now()
      }
    });
  };
}

export function hydrateCustomerAuth(customerSecretId) {
  return (dispatch, getState) => {
    const { customerGalleries } = getState();
    const categories = customerGalleries.categories;
    const category = findKey(categories, { secretId: customerSecretId });
    const secretId = categories[category].secretId;
    if (secretId === customerSecretId) {
      dispatch({
        type: CUSTOMER_SIGN_IN_SUCCESS,
        payload: { secretId }
      });
    }
  };
}

export function resetAuthMessages(timeout = 3250) {
  return dispatch => {
    delay(() => {
      dispatch({
        type: RESET_AUTH_MESSAGES
      });
    }, timeout);
  };
}

export function submitCustomerGalleriesPassword(opts) {
  return (dispatch, getState) => {
    const { customerGalleries } = getState();
    const categories = customerGalleries.categories;
    const category = findKey(categories, {slug: opts.path });
    const secretId = categories[category].secretId;
    if (category && secretId === opts.password) {
      sessionStorage.setItem('customerSecretId', secretId);
      dispatch({
        type: CUSTOMER_SIGN_IN_SUCCESS,
        payload: { secretId }
      });
    }
    else {
      opts.errorCallback();
    }
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

export function signInWithEmail(email, password, router) {
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
      router.replace(POST_LOGIN_PATH);
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

export function changePassword(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const user = firebase.auth().currentUser;

    user.updatePassword(opts.newPassword).then(() => {
      opts.successAlert('Password');
    }, error => {
      opts.errorAlert(error);
    });
  };
}

export function changeEmail(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const user = firebase.auth().currentUser;

    user.updateEmail(opts.newEmail).then(() => {
      opts.successAlert('Email');
    }, error => {
      opts.errorAlert(error);
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


export function signOut(router) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      dispatch({
        type: SIGN_OUT_SUCCESS
      });
      router.replace(POST_LOGOUT_PATH);
    });
  };
}
