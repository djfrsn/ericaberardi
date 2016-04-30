import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class Login extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    signInWithEmail: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  };
  onLogin = e => {
    e.preventDefault();
    this.props.signInWithEmail(this.email.value, this.password.value);
  }
  render() {
    const { auth } = this.props;
    const errorMsg = auth.error ? (<p className="login__error-msg">Invalid email/password</p>) : null;
    let component = <button className="sign-in__button" onClick={this.props.signOut}>Sign Out</button>;
    if (!auth.authenticated) {
      component = (<div><h1 className="sign-in__heading">Admin</h1>
        <form onSubmit={this.onLogin}>
          <input type="text" placeholder="Email" ref={ref => this.email = ref}/>
          <input type="password" placeholder="Password" ref={ref => this.password = ref}/>
          <button type="submit" className="sign-in__button" onClick={this.onLogin}>Login</button>
        </form>
        {errorMsg}</div>);
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
}), authActions)(Login);
