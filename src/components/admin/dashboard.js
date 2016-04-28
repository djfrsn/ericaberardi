import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';


export class DashBoard extends Component {
  render() {

    return (
      <div className="g-row sign-in">
        <div className="g-col">
          <h1 className="sign-in__heading">Admin DashBoard</h1>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(DashBoard);
