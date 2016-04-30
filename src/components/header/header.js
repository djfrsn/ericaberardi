import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired
  };
  render() {
    const { auth } = this.props;
    const { router } = this.context;
    return (
      <header className="header">
        <div className="g-row">
          <div className="g-col">
            <a href="/" className="home__link">
              <h1 className="header__title">Erica Berardi</h1>
              <h2 className="header__sub_title">Photography</h2>
            </a>
            <ul className="header__links">
              <li><a className={classNames('header__link', {'active': router.isActive('galleries')})} href="/galleries">Galleries</a></li>
              <li><a className={classNames('header__link', {'active': router.isActive('news-reporting')})} href="/news-reporting">News Reporting</a></li>
              <li><a className={classNames('header__link', {'active': router.isActive('about')})} href="/about">About</a></li>
              <li><a className={classNames('header__link', {'active': router.isActive('contact')})} href="/contact">Contact</a></li>
              {auth.authenticated ? <li><a className="header__link" onClick={this.props.signOut} href="#">Sign out</a></li> : null}
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
