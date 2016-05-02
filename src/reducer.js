import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import { authReducer } from 'core/auth';
import { adminReducer } from 'core/admin';
import { galleriesReducer } from 'core/galleries';
import { toastReducer } from 'core/toast';
import { firebaseReducer } from 'core/firebase';
import { notificationReducer } from 'core/notification';
import { tasksReducer } from 'core/tasks';


export default combineReducers({
  auth: authReducer,
  admin: adminReducer,
  galleries: galleriesReducer,
  toast: toastReducer,
  firebase: firebaseReducer,
  notification: notificationReducer,
  routing: routerReducer,
  tasks: tasksReducer
});
