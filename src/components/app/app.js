import React, { Component, PropTypes } from 'react';
import Header from '../header/header';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { adminActions } from 'core/admin';


export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { children } = this.props;
    return (
      <div>
        <Header />

        <main className="main">{children}</main>

        <footer>© 2016 by Erica Berardi Photography LLC & <a href="https://digitalarch.com">Digital Architecture</a></footer>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), Object.assign({}, authActions, adminActions))(App);
