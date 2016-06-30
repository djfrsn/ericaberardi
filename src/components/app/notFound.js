import React, { Component } from 'react';

export class NotFound extends Component {
  render() {
    // const authenticated = this.props.auth.authenticated;
    return (
      <div className="g-row">
        <div className="g-col notfound">
          <h1>OOPS...Page Not Found!</h1>
          <p>You may have mis-spelled something. Please check your spelling.</p>
        </div>
      </div>
    );
  }
}

export default NotFound;
// [ Under Construction ]
