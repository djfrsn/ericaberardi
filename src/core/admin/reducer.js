import {
  SIGN_OUT_SUCCESS
} from 'core/auth';

import {
  CLEAR_TOAST,
  SET_PENDING_UPDATES_COUNT,
  SET_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CLEAR_UPDATES_ERROR,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS
} from './action-types';


export const initialState = {
  pendingUpdates: {},
  pendingUpdatesCount: 0,
  setPendingUpdatesDone: false,
  toast: {}
};


export function adminReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TOAST:
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
        pendingUpdatesCount: action.payload.pendingUpdatesCount,
        setPendingUpdatesDone: true
      };

    case PUBLISH_SUCCESS:
      return {
        ...state,
        publishSuccess: true,
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

    case DELETE_TASK_SUCCESS:
      return {
        deleted: action.payload,
        list: state.list.filter(task => {
          return task.key !== action.payload.key;
        }),
        previous: [ ...state.list ]
      };

    case UPDATE_TASK_SUCCESS:
      return {
        deleted: null,
        list: state.list.map(task => {
          return task.key === action.payload.key ? action.payload : task;
        }),
        previous: []
      };

    case SIGN_OUT_SUCCESS:
      return {
        deleted: null,
        list: [],
        previous: []
      };

    default:
      return state;
  }
}
