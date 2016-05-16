import {
  INIT_PHOTOSWIPE,
} from './action-types';

// photoswipe strategy
// on link click dispatch id to initPhotoswipe
// get src & use utils.cloudinary to transform into gallery-lightbox url depending on size
// iniy photoswipe w/ array of current gallery & index of given img/id

export function initPhotoswipe() {
  return dispatch => {
    dispatch({
      type: INIT_PHOTOSWIPE
    });
  };
}
