import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class SignIn extends Component {
  static propTypes = {
    signInWithGithub: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
    signInWithTwitter: PropTypes.func.isRequired
  };

  render() {
    // const {
    //   signInWithGithub,
    //   signInWithGoogle,
    //   signInWithTwitter
    // } = this.props;

    return (
      <div className="g-row sign-in">
        <div className="g-col">

        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(SignIn);
