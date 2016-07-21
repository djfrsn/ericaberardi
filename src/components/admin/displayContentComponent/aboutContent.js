import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { contentEditingActions } from 'core/contentEditing';
import { authActions } from 'core/auth';

export class AboutContent extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
    contentEditing: PropTypes.object.isRequired
  };
  onSignOut = e => {
    e.preventDefault();
    this.props.signOut(this.context.router);
  }
  onLogin = e => {
    e.preventDefault();
    this.props.signInWithEmail(this.email.value, this.password.value, this.context.router);
  }
  render() {
    const { auth, contentEditing } = this.props;
    let component = <p style={{textAlign: 'center', marginTop: '60px'}}><Link to="/login">Login</Link> to edit content.</p>;
    if (auth.authenticated) {
      component = (<div>
         hello
      </div>);
    }
    return (
      <div className="g-row content-editing">
        <div className="g-col">
          {component}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  contentEditing: state.contentEditing
}), Object.assign({}, authActions, contentEditingActions))(AboutContent);
