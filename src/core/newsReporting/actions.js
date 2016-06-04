import {
  HYDRATE_NEWS_REPORTING
} from './action-types';

export function hydrateNewsReporting(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_NEWS_REPORTING,
      payload: data
    });
  };
}
