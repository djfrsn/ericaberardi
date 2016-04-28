import React, { Component, PropTypes } from 'react';
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
    const { auth, children } = this.props;

    return (
      <div>
        <header className="header">
          <div className="g-row">
            <div className="g-col">
              <a href="/" className="home__link">
                <h1 className="header__title">Erica Berardi</h1>
                <h2 className="header__sub_title">Photography</h2>
              </a>
              <ul className="header__links">
                <li><a className="header__link" href="/galleries">Galleries</a></li>
                <li><a className="header__link" href="/news-reporting">News Reporting</a></li>
                <li><a className="header__link" href="/about">About</a></li>
                <li><a className="header__link" href="/contact">Contact</a></li>
                {auth.authenticated ? <li><a className="header__link" onClick={this.signOut} href="#">Sign out</a></li> : null}
              </ul>
            </div>
          </div>
        </header>

        <main className="main">{children}</main>

        <footer>© 2016 by Erica Berardi & <a href="https://digitalarch.com">Digital Architecture</a></footer>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(App);
