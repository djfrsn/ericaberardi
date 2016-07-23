import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import { aboutReducer } from 'core/about';
import { authReducer } from 'core/auth';
import { adminReducer } from 'core/admin';
import { customerGalleriesReducer } from 'core/customerGalleries';
import { galleriesReducer } from 'core/galleries';
import { lightboxReducer } from 'core/lightbox';
import { newsReportingReducer } from 'core/newsReporting';
import { pricingReducer } from 'core/pricing';
import { contactReducer } from 'core/contact';
import { toastReducer } from 'core/toast';
import { firebaseReducer } from 'core/firebase';


export default combineReducers({
  about: aboutReducer,
  auth: authReducer,
  admin: adminReducer,
  customerGalleries: customerGalleriesReducer,
  galleries: galleriesReducer,
  lightbox: lightboxReducer,
  newsReporting: newsReportingReducer,
  pricing: pricingReducer,
  contact: contactReducer,
  toast: toastReducer,
  firebase: firebaseReducer,
  routing: routerReducer
});
