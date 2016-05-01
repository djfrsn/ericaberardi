import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired
  };
  reRender = () => {
    this.forceUpdate(); // ugly hack since activeClassName only works on page refresh
  }
  render() {
    const { auth } = this.props;
    return (
      <header className="header">
        <div className="g-row">
          <div className="g-col">
            <Link to="/" onClick={this.reRender} className="home__link" >
              <h1 className="header__title">Erica Berardi</h1>
              <h2 className="header__sub_title">Photography</h2>
            </Link>
            <ul className="header__links">
              <li><Link to="galleries" className="header__link" onClick={this.reRender} activeClassName="active">Galleries</Link></li>
              <li><Link to="about" className="header__link" onClick={this.reRender} activeClassName="active">About</Link></li>
              <li><Link to="contact" className="header__link" onClick={this.reRender} activeClassName="active">Contact</Link></li>
              {auth.authenticated ? <li><Link to="dashboard" className="header__link" onClick={this.reRender} activeClassName="active">Dashboard</Link></li> : null}
              {auth.authenticated ? <li><Link to="/" className="header__link" onClick={this.props.signOut} >Sign out</Link></li> : null}
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