import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class Login extends Component {
  static propTypes = {
    signInWithEmail: PropTypes.func.isRequired
  };
  onLogin = () => {
    this.props.signInWithEmail(this.email.value, this.password.value);
  }
  render() {
    return (
      <div className="g-row sign-in">
        <div className="g-col">
          <h1 className="sign-in__heading">Admin</h1>
          <input type="text" placeholder="Email" ref={ref => this.email = ref}/>
          <input type="password" placeholder="Password" ref={ref => this.password = ref}/>
          <button className="sign-in__button" onClick={this.onLogin}>Login</button>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(Login);
