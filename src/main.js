import 'newrelic';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as firebase from 'firebase';
import 'styles/styles.scss';
import { Root } from 'components/root';
import { authActions /* , authRouteResolver */ } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleriesActions } from 'core/galleries';
import { newsReportingActions } from 'core/newsReporting';
import { pricingActions } from 'core/pricing';
import { FIREBASE_CONFIG } from './config';
import configureStore from './store';

const store = configureStore({
  firebase: firebase.initializeApp(FIREBASE_CONFIG)
});

const history = syncHistoryWithStore(browserHistory, store);

firebase.auth().onAuthStateChanged(user => { // run everytime auth state changes to update protected data
  store.dispatch(galleriesActions.hydrateGalleries()); // hydrate to hide/show protected content
  if (user) {
    store.dispatch(authActions.hydrateAuth());
  }
});

let galleries = firebase.database().ref('galleries');
let newsReporting = firebase.database().ref('newsReporting');
let pricing = firebase.database().ref('pricing');

galleries.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('galleries', data));
  store.dispatch(galleriesActions.hydrateGalleries(data));
});

newsReporting.on('value', snapshot => {
  store.dispatch(newsReportingActions.hydrateNewsReporting(snapshot.val()));
});


pricing.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('pricing', data));
  store.dispatch(pricingActions.hydratePricing(data));
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
