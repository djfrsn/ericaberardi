import React, { Component } from 'react';
import SocialIcons from './socialIcons';

export class Footer extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col footer">

          <SocialIcons/>

          <footer>© 2016 by Erica Berardi Photography LLC & <a href="https://digitalarch.com">Digital Architecture</a></footer>
        </div>
      </div>
    );
  }
}

export default Footer;
