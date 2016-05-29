import {
  CLEAR_ADMIN_TOAST,
  CLEAR_ADMIN_SWAL,
  SET_PENDING_UPDATES_COUNT,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES,
  PUBLISH_ERROR,
  PUBLISH_INAVLID,
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

    case CLEAR_ADMIN_SWAL:
      return {
        ...state
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

    case PUBLISH_ERROR:
      return {
        ...state,
        publishError: action.error,
        toast: {
          firstLine: 'Error!',
          secondLine: 'Publish failed! Please try again.',
          type: 'error'
        }
      };

    case PUBLISH_INAVLID:
      return {
        ...state,
        toast: {
          firstLine: 'Invalid content Updates!',
          secondLine: 'Try adding more content before publishing.',
          type: 'error'
        }
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
