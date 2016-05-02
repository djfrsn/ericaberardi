import {
  SIGN_OUT_SUCCESS
} from 'core/auth';

import {
  INIT_ADMIN,
  LOAD_PENDING_UPDATES,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS
} from './action-types';


export const initialState = {
  pendingUpdates: []
};


export function adminReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_ADMIN:
      return {
        ...state
      };

    case LOAD_PENDING_UPDATES:
      let pendingUpdates = [];
      for (let gallery in action.payload) {
        if (gallery) {
          pendingUpdates.push({ gallery, data: action.payload[gallery]});
        }
      }
      return {
        ...state,
        pendingUpdates: pendingUpdates
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
