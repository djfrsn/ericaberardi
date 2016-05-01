import {
  INIT_TOAST
} from './action-types';

export function initToast() {
  return dispatch => {
    dispatch({
      type: INIT_TOAST
    });
  };
}
