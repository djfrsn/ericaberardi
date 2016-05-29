import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as firebase from 'firebase';
import 'styles/styles.scss';
import { Root } from 'components/root';
import { authActions /* , authRouteResolver */ } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleryActions } from 'core/galleries';
import { newsReportingActions } from 'core/newsReporting';
import { ENV, FIREBASE_CONFIG } from './config';
import configureStore from './store';

const store = configureStore({
  firebase: firebase.initializeApp(FIREBASE_CONFIG)
});

const history = syncHistoryWithStore(browserHistory, store);

firebase.auth().onAuthStateChanged(user => { // run everytime auth state changes
  if (user) {
    store.dispatch(authActions.initAuth());

    let pendingGalleries = firebase.database().ref(`${ENV}/pendingUpdates/galleries`);

    pendingGalleries.on('value', snapshot => {
      const snapshotVal = snapshot.val();

      store.dispatch(galleryActions.hydratePendingGalleries(snapshotVal));
      store.dispatch(adminActions.setPendingUpdates('galleries', snapshotVal));
    });
  }
});

let galleries = firebase.database().ref(`${ENV}/galleries`);
let newsReporting = firebase.database().ref(`${ENV}/newsReporting`);

galleries.on('value', snapshot => {
  store.dispatch(galleryActions.hydrateGalleries(snapshot.val()));
});

newsReporting.on('value', snapshot => {
  store.dispatch(newsReportingActions.hydrateNewsReporting(snapshot.val()));
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
