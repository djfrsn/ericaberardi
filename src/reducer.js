import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import { authReducer } from 'core/auth';
import { adminReducer } from 'core/admin';
import { galleriesReducer } from 'core/galleries';
import { toastReducer } from 'core/toast';
import { firebaseReducer } from 'core/firebase';


export default combineReducers({
  auth: authReducer,
  admin: adminReducer,
  galleries: galleriesReducer,
  toast: toastReducer,
  firebase: firebaseReducer,
  routing: routerReducer
});
