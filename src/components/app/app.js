import React, { Component, PropTypes } from 'react';
import Header from '../header/header';
import { connect } from 'react-redux';
import { POST_LOGIN_PATH } from 'config';
import { authActions } from 'core/auth';


export class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.signOut = this.signOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { auth } = this.props;

    if (!auth.authenticated && nextProps.auth.authenticated) {
      router.replace(POST_LOGIN_PATH);
    }
  }

  signOut() {
    this.props.signOut();
    window.location.replace('/');
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <Header />

        <main className="main">{children}</main>

        <footer>© 2016 by Erica Berardi & <a href="https://digitalarch.com">Digital Architecture</a></footer>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(App);
