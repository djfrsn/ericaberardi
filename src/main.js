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
import once from 'lodash.once';

const store = configureStore({
  firebase: firebase.initializeApp(FIREBASE_CONFIG)
});

const history = syncHistoryWithStore(browserHistory, store);

firebase.auth().onAuthStateChanged(once(user => { // run once on login
  if (user) {
    store.dispatch(authActions.initAuth());
    store.dispatch(adminActions.initAdmin());
  }
}));

let galleries = firebase.database().ref('dev/galleries');
// TODO do these refs cause all data to be piped on every change or is only what changed pass?
// check the network panel to see data usage on upload for abnormal transfer amounts
let pendingGalleries = firebase.database().ref('dev/pendingGalleries');
let newsReporting = firebase.database().ref('dev/newsReporting');

galleries.on('value', snapshot => {
  store.dispatch(galleryActions.initGalleries(snapshot.val()));
});

pendingGalleries.on('value', snapshot => {
  store.dispatch(galleryActions.initPendingGalleries(snapshot.val()));
});

newsReporting.on('value', snapshot => {
  store.dispatch(newsReportingActions.initNewsReporting(snapshot.val()));
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
