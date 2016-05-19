import {
  INIT_LIGHTBOX,
  ON_SWIPE,
  ON_CLOSE
} from './action-types';
// photoswipe strategy
// on link click dispatch id to initPhotoswipe
// get src & use utils.cloudinary to transform into gallery-lightbox url depending on size
// iniy photoswipe w/ array of current gallery & index of given img/id

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
  return dispatch => {
    dispatch({
      type: ON_CLOSE
    });
  };
}
