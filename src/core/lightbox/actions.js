import {
  INIT_LIGHTBOX,
  ON_SWIPE,
  ON_CLOSE
} from './action-types';

export function showLightbox(opts) {
  return dispatch => {
    dispatch({
      type: INIT_LIGHTBOX,
      payload: opts
    });
  };
}

export function onSwipe(direction) {
  return dispatch => {
    dispatch({
      type: ON_SWIPE,
      payload: direction
    });
  };
}


export function onClose() {
  document.querySelector('body').className = '';
  return dispatch => {
    dispatch({
      type: ON_CLOSE
    });
  };
}
