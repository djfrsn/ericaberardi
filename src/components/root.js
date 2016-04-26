import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router';

// Config
import { SIGN_IN_PATH, HOME_PATH, TASKS_PATH } from 'config';

// Components
import App from './app/app';
import Home from './home/home';
import SignIn from './sign-in/sign-in';
import Tasks from './tasks/tasks';


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
            <Route component={Home} path={HOME_PATH}/>
            <Route component={SignIn} path={SIGN_IN_PATH}/>
            <Route component={Tasks} path={TASKS_PATH}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}
