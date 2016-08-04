require('offline-plugin/runtime').install();
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as firebase from 'firebase';
import 'styles/styles.scss';
import { Root } from 'components/root';
import { authActions } from 'core/auth';
import { aboutActions } from 'core/about';
import { adminActions } from 'core/admin';
import { galleriesActions } from 'core/galleries';
import { customerGalleriesActions } from 'core/customerGalleries';
import { newsReportingActions } from 'core/newsReporting';
import { pricingActions } from 'core/pricing';
import { contactActions } from 'core/contact';
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

    let customerGalleries = firebase.database().ref('customerGalleries');

    customerGalleries.on('value', snapshot => {
      store.dispatch(customerGalleriesActions.hydrateCustomerGalleries(snapshot.val()));
    });
  }
});

let galleries = firebase.database().ref('galleries');
let newsReporting = firebase.database().ref('newsReporting');
let about = firebase.database().ref('about');
let contact = firebase.database().ref('contact');
let pricing = firebase.database().ref('pricing');

galleries.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('galleries', data));
  store.dispatch(galleriesActions.hydrateGalleries(data));
});

about.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('about', data));
  store.dispatch(aboutActions.hydrateAbout(data));
});

contact.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('contact', data));
  store.dispatch(contactActions.hydrateContact(data));
});

newsReporting.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('newsReporting', data));
  store.dispatch(newsReportingActions.hydrateNewsReporting(data));
});

pricing.on('value', snapshot => {
  const data = snapshot.val();
  store.dispatch(adminActions.setPendingUpdates('pricing', data));
  store.dispatch(pricingActions.hydratePricing(data));
});

ReactDOM.render((
  <Root history={history} store={store}/>
), document.querySelector('.app-root'));
