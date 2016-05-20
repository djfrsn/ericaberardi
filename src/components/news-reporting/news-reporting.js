import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class NewsReporting extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="articles__construction">
            <div className="article">
              <h2>Title</h2>
              <h4>Company</h4>
              <p className="article__content">...</p>
              <a href="#" className="article__link">Read Full Story</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(NewsReporting);
