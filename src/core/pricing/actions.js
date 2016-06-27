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

export function editPricingCategory(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.database().ref(`pricing/categories/${opts.id}`).update({pendingCategory: opts.text, pending: true});
  };
}

export function editPricingPackages(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.database().ref(`pricing/packages/${opts.newPkgsCategory.categoryId}`).set(opts.newPkgsCategory);
  };
}
