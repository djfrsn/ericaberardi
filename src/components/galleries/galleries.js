import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class Galleries extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="under__construction">
          [ Under Construction ]
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(Galleries);
