import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import Gallery from './gallery';

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
      <div className="g-row">
        <div className="g-col">
          <Gallery />
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(SignIn);
