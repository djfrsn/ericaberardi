
import {
  INIT_NEWS_REPORTING
} from './action-types';


export const initialState = {
  articles: []
};

export function newsReportingReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_NEWS_REPORTING:
      return initNewsReporting(state, action);

    default:
      return state;
  }
}

function initNewsReporting(state, action) {
  return {
    ...state,
    articles: action.payload
  };
}
