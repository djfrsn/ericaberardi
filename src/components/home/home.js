import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import HomeGallery from './homeGallery';

export class Home extends Component {
  render() {
    return (
      <div className="g-row" ref={ref => this.row = ref}>
        <div className="g-col" >
          <HomeGallery />
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(Home);
