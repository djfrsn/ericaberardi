import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import 'styles/styles.scss';
import { Root } from 'components/root';
import { authActions /* , authRouteResolver */ } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleryActions } from 'core/galleries';
import { newsReportingActions } from 'core/newsReporting';
import { FIREBASE_CONFIG } from './config';
import configureStore from './store';

const store = configureStore({
  firebase: firebase.initializeApp(FIREBASE_CONFIG)
});

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(authActions.initAuth());

store.dispatch(adminActions.initAdmin());

let galleries = firebase.database().ref('dev/galleries');

galleries.on('value', snapshot => {
  store.dispatch(galleryActions.initGalleries(snapshot.val()));
});

let newsReporting = firebase.database().ref('dev/newsReporting');

newsReporting.on('value', snapshot => {
  store.dispatch(newsReportingActions.initNewsReporting(snapshot.val()));
});

let storage = firebase.storage();
var storageRef = storage.ref();
storageRef.child('commercial/brilliancebalm.jpg').getDownloadURL().then(function(url) {
  // Get the download URL for 'images/stars.jpg'
  // This can be inserted into an <img> tag
  // This can also be downloaded directly
  debugger
}).catch(function(error) {
  // Handle any errors
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
