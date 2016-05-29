import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES_COUNT,
  SET_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CLEAR_UPDATES_SUCCESS,
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

    case PUBLISH_SUCCESS:
      return {
        ...state,
        pendingUpdates: {},
        pendingUpdatesCount: 0,
        toast: {
          firstLine: 'Success!',
          secondLine: 'Your updates are live!.',
          type: 'success'
        }
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

    case CLEAR_UPDATES_SUCCESS:
      return {
        ...state,
        pendingUpdates: {},
        pendingUpdatesCount: 0,
        toast: {
          firstLine: 'Success!',
          secondLine: 'Pending updates have been cleared!',
          type: 'success'
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
