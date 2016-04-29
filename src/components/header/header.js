import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  render() {
    const { auth } = this.props;
    return (
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
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(Header);
