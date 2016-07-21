
import {
  LOAD_CONTENT,
  EDIT_CONTENT
} from './action-types';


export const initialState = {
  content: {
    'news-reporting': {},
    pricing: {}
  }
};

export function contentEditingReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONTENT:

      return {
        ...state,
        content: {
          ...state.content,
          [action.payload.category]: action.payload.data
        }
      };

    default:
      return state;
  }
}
