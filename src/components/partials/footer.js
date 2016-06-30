import React, { Component } from 'react';
import socialIcons from './socialIcons';

export class NotFound extends Component {
  render() {
    // const authenticated = this.props.auth.authenticated;
    return (
      <div className="g-row">
        <div className="g-col notfound">

          {socialIcons()}

          <footer>© 2016 by Erica Berardi Photography LLC & <a href="https://digitalarch.com">Digital Architecture</a></footer>
        </div>
      </div>
    );
  }
}

export default NotFound;
