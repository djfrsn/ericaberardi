import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { lightboxActions } from 'core/lightbox';
import * as gUtils from './galleriesUtils';

export default class Lightbox extends Component {
  static propTypes = {
    lightbox: PropTypes.object.isRequired
  }
  render() {
    const { slides } = this.props.lightbox || {};
    //const cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src }) || {};
    return (
      <div className="gllry-lightbox">
        <div className="gllry-content">
          <div className="gllry-controls"><span className="gllry-controls-left">left</span><span className="gllry-controls-right">right</span></div>
          <div className="gllry-img">
            <img src={"cloud.src"}/>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(state => ({
  lightbox: state.lightbox
}), Object.assign({}, lightboxActions))(Lightbox);