import Firebase from 'firebase';
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
import { FIREBASE_URL } from './config';
import configureStore from './store';


const store = configureStore({
  firebase: new Firebase(FIREBASE_URL)
});

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(authActions.initAuth());

store.dispatch(adminActions.initAdmin());

let galleries = new Firebase(`${FIREBASE_URL}/galleries`);

galleries.on('value', snapshot => {
  store.dispatch(galleryActions.initGalleries(snapshot.val()));
});

let newsReporting = new Firebase(`${FIREBASE_URL}/newsReporting`);

newsReporting.on('value', snapshot => {
  store.dispatch(newsReportingActions.initNewsReporting(snapshot.val()));
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
