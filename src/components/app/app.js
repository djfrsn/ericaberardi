import React, { Component, PropTypes } from 'react';
import Header from '../partials/header';
import Footer from '../partials/footer';
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

        <Footer />
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), Object.assign({}, authActions, adminActions))(App);
