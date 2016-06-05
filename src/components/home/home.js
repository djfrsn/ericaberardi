import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { galleriesActions } from 'core/galleries';
import homeGallery from './homeGallery';

export class Home extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    galleries: PropTypes.object.isRequired
  }
  render() {
    return (
      <div className="g-row" ref={ref => this.row = ref}>
        <div className="g-col" >
          {homeGallery({...this.props.galleries, scope: this})}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  galleries: state.galleries
}), Object.assign({}, galleriesActions, authActions))(Home);
