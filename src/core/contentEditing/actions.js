import {
  LOAD_CONTENT
} from './action-types';

export function loadContent(category, data) {
  return dispatch => {
    dispatch({
      type: LOAD_CONTENT,
      payload: { category, data }
    });
  };
}
