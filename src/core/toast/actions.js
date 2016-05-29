import {
  INIT_TOAST,
  CLEAR_TOAST,
  SHOW_TOAST
} from './action-types';

export function initToast() {
  return dispatch => {
    dispatch({
      type: INIT_TOAST
    });
  };
}

export function clearToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_TOAST
    });
  };
}

export function showToast(data) {
  return dispatch => {
    dispatch({
      type: SHOW_TOAST,
      payload: data
    });
  };
}
