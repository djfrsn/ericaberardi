
import {
  HYDRATE_NEWS_REPORTING
} from './action-types';


export const initialState = {
  articles: {}
};

export function newsReportingReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE_NEWS_REPORTING:
      return hydrateNewsReporting(state, action);

    default:
      return state;
  }
}

function hydrateNewsReporting(state, action) {
  return {
    ...state,
    articles: action.payload.articles
  };
}
