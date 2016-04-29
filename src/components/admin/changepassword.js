import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class ChangePassword extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    signInWithEmail: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  };
  changePassword = e => {
    e.preventDefault();
    this.props.changePassword(this.oldPassword.value, this.newPassword.value);
  }
  render() {
    const { auth } = this.props;
    const errorMsg = auth.error ? (<p className="login__error-msg">Invalid Old Password/New Password</p>) : null;
    return (
     <div><h1 className="sign-in__heading">Change Password</h1>
        <form onSubmit={this.changePassword}>
          <input type="text" placeholder="Old Password" ref={ref => this.oldPassword = ref}/>
          <input type="password" placeholder="New Password" ref={ref => this.newPassword = ref}/>
          <button type="submit" className="password-submit__button" onClick={this.changePassword}>Submit</button>
        </form>
        {errorMsg}
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth
}), authActions)(ChangePassword);
