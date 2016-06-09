import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES_COUNT,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES,
  CLEAR_UPDATES_ERROR
} from './action-types';


export const initialState = {
  pendingUpdates: {},
  pendingUpdatesCount: 0,
  toast: {}
};


export function adminReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ADMIN_TOAST:
      return {
        ...state,
        toast: {}
      };

    case SET_PENDING_UPDATES_COUNT:
      return {
        ...state,
        pendingUpdatesCount: action.payload.pendingUpdatesCount
      };

    case SET_PENDING_UPDATES:
      return {
        ...state,
        pendingUpdates: action.payload.pendingUpdates,
        pendingUpdatesCount: action.payload.pendingUpdatesCount
      };

    case CLEAR_PENDING_UPDATES:
      return {
        ...state,
        pendingUpdates: {},
        pendingUpdatesCount: 0
      };

    case CLEAR_UPDATES_ERROR:
      return {
        ...state,
        publishError: action.error,
        toast: {
          firstLine: 'Error!',
          secondLine: 'Clearing updates failed! Please try again.',
          type: 'error'
        }
      };

    default:
      return state;
  }
}
