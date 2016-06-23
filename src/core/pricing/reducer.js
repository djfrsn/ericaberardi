
import {
  HYDRATE_PRICING
} from './action-types';


export const initialState = {
  categories: {},
  packages: {}
};

export function pricingReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_PRICING:
      return hydratePricing(state, action);

    default:
      return state;
  }
}

function hydratePricing(state, action) {
  return {
    ...state,
    ...action.payload
  };
}
