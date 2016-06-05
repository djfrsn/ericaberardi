import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import homeGallery from './homeGallery';

export class Home extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired
  }
  render() {
    return (
      <div className="g-row" ref={ref => this.row = ref}>
        <div className="g-col" >
          {homeGallery({...this.props.galleries})}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  galleries: state.galleries
}), Object.assign({}, galleryActions))(Home);
