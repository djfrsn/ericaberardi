import {
  SIGN_OUT_SUCCESS
} from 'core/auth';

import {
  INIT_ADMIN,
  LOAD_PENDING_UPDATES,
  PUBLISH_SUCCESS,
  PUBLISH_ERROR,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS
} from './action-types';


export const initialState = {
  pendingUpdates: [],
  pendingUpdatesRaw: []
};


export function adminReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_ADMIN:
      return {
        ...state
      };

    case LOAD_PENDING_UPDATES:
      let pendingUpdates = [];
      for (let name in action.payload) {
        if (name) {
          pendingUpdates.push({ name, data: action.payload[name]});
        }
      }
      return {
        ...state,
        pendingUpdates: pendingUpdates,
        pendingUpdatesRaw: action.payload || []
      };

    case PUBLISH_SUCCESS:
      return {
        ...state,
        publishSuccess: true,
        publishedChangesDeleteQueue: action.payload
      };

    case PUBLISH_ERROR:
      return {
        ...state,
        publishError: action.error
      };

    case CREATE_TASK_SUCCESS:
      let list;

      if (state.deleted && state.deleted.key === action.payload.key) {
        list = [ ...state.previous ];
      }
      else {
        list = [ action.payload, ...state.list ];
      }

      return {
        deleted: null,
        list,
        previous: []
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
