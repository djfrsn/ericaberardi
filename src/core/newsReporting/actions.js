import {
  HYDRATE_NEWS_REPORTING
} from './action-types';
// photoswipe strategy
// on link click dispatch id to initPhotoswipe
// get src & use utils.cloudinary to transform into gallery-lightbox url depending on size
// iniy photoswipe w/ array of current gallery & index of given img/id

export function hydrateNewsReporting(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_NEWS_REPORTING,
      payload: data
    });
  };
}
