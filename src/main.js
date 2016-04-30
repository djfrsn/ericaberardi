import Firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import 'styles/styles.scss';
import { Root } from 'components/root';
import { authActions /* , authRouteResolver */ } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { FIREBASE_URL } from './config';
import configureStore from './store';


const store = configureStore({
  firebase: new Firebase(FIREBASE_URL)
});

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(authActions.initAuth());
console.log(`${FIREBASE_URL}/homeGallery`)
const homeGallery = new Firebase(`${FIREBASE_URL}/homeGallery`);

homeGallery.on('value', snapshot => {
  debugger
  store.dispatch(galleryActions.initHomeGallery(snapshot.val()));
});

const galleries = new Firebase(`${FIREBASE_URL}/galleries`);

galleries.on('value', snapshot => {

  debugger
  store.dispatch(galleryActions.initGalleries(snapshot.val()));
});

ReactDOM.render((
  <Root history={history} /* onEnter={authRouteResolver(store.getState)} */ store={store}/>
), document.querySelector('.app-root'));
