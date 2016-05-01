import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import { authReducer } from 'core/auth';
import { galleriesReducer } from 'core/galleries';
import { firebaseReducer } from 'core/firebase';
import { notificationReducer } from 'core/notification';
import { tasksReducer } from 'core/tasks';


export default combineReducers({
  auth: authReducer,
  galleries: galleriesReducer,
  firebase: firebaseReducer,
  notification: notificationReducer,
  routing: routerReducer,
  tasks: tasksReducer
});
