import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute } from 'react-router';

// Config
import { LOGIN_PATH, CHANGE_PASSWORD_PATH, DASHBOARD_PATH, HOME_PATH, GALLERIES_PATH, NEWS_REPORTING_PATH, PRICING_PATH, ABOUT_PATH, CONTACT_PATH } from 'config';

// Components
import App from './app/app';
import Home from './home/home';
import Galleries from './galleries/galleries';
import NewsReporting from './news-reporting/news-reporting';
import Pricing from './pricing/pricing';
import About from './about/about';
import Contact from './contact/contact';
import Login from './admin/login';
import ChangePassword from './admin/changePassword';
import Dashboard from './admin/dashboard';

// TODO: <Route component={NotFound} path='*'/>

export class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    // onEnter: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  };

  render() {
    const { history, /* onEnter, */ store } = this.props;

    return (
      <Provider store={store}>
        <Router history={history}>
          <Route component={App} /* onEnter={onEnter} */ path="/">
            <IndexRoute component={Home}/>
            <Route component={Home} path={HOME_PATH}/>
            <Route component={Galleries} path={GALLERIES_PATH}/>
            <Route component={NewsReporting} path={NEWS_REPORTING_PATH}/>
            <Route component={Pricing} path={PRICING_PATH}/>
            <Route component={About} path={ABOUT_PATH}/>
            <Route component={Contact} path={CONTACT_PATH}/>
            <Route component={Login} path={LOGIN_PATH}/>
            <Route component={ChangePassword} path={CHANGE_PASSWORD_PATH}/>
            <Route component={Dashboard} path={DASHBOARD_PATH}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}
