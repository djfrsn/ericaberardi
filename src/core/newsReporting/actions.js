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

export function editArticles(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.database().ref('newsReporting/articles').set(opts.articles);
  };
}

