import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class ChangePassword extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    resetAuthMessages: PropTypes.func.isRequired
  };
  changePassword = e => {
    e.preventDefault();
    this.props.changePassword(this.oldPassword.value, this.newPassword.value);
  }
  render() {
    const { auth, resetAuthMessages } = this.props;
    let msg = null;
    if (auth.changePasswordError) {
      msg = (<p className="change-password__error-msg">Invalid password combination.</p>);
      resetAuthMessages();
    }
    else if (auth.changePasswordSuccess) {
      msg = (<p className="change-password__success-msg">Successful!</p>);
      resetAuthMessages();
    }
    let component = <p style={{textAlign: 'center'}}><a href="/admin">Login</a> to change your password.</p>;
    if (auth.authenticated) {
      component = (<div><h1 className="sign-in__heading">Change Password</h1>
        <form onSubmit={this.changePassword}>
          <input type="password" placeholder="Old Password" ref={ref => this.oldPassword = ref}/>
          <input type="password" placeholder="New Password" ref={ref => this.newPassword = ref}/>
          <button type="submit" className="password-submit__button" onClick={this.changePassword}>Submit</button>
        </form>
        {msg}</div>);
    }
    return (
      <div className="g-row sign-in">
        <div className="g-col">
          {component}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(ChangePassword);
