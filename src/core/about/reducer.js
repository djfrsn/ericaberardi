
import {
  HYDRATE_ABOUT
} from './action-types';


export const initialState = {
  content: {},
  resume: {},
  profilepicture: {}
};

export function aboutReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_ABOUT:
      return hydrateAbout(state, action);

    default:
      return state;
  }
}

function hydrateAbout(state, action) {
  return {
    ...state,
    ...action.payload
  };
}
