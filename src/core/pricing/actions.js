import {
  HYDRATE_PRICING
} from './action-types';

export function hydratePricing(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_PRICING,
      payload: data
    });
  };
}
