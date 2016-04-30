import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class DashBoard extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  render() {
    const { auth } = this.props;
    let component = <p style={{textAlign: 'center'}}><a href="/admin">Login</a> to use the dashboard.</p>;
    if (auth.authenticated) {
      component = (<div><h1 className="sign-in__heading">Admin DashBoard</h1>
        <Link to="changepassword" className="change-password__link" >Change Password</Link></div>);
    }
    return (
      <div className="g-row dashboard">
        <div className="g-col">
          {component}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(DashBoard);
