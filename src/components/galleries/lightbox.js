import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { lightboxActions } from 'core/lightbox';
import * as gUtils from './galleriesUtils';

export default class Lightbox extends Component {
  static propTypes = {
    lightbox: PropTypes.object.isRequired
  }
  render() {
    const { slides, show } = this.props.lightbox || {};
    //const cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src }) || {};
    const lbxclass = 'gllry-lightbox';
    const lightboxClass = show ? `${lbxclass} show` : lbxclass;
    const gllryImages = slides.length > 0 ? slides.map(slide => {
      const gllryImgClass = 'gllry-img';
      const imgClass = slide.active ? gllryImgClass : `${gllryImgClass} hide`;
      return (
        <div key={slide.id} className={imgClass}>
          <img src={slide.src}/>
        </div>
      );
    }) : null;
    // strategy
    // show lightbox val is true
    // slides has active slide true and others active false
    return (
      <div className={lightboxClass}>
        <div className="gllry-content">
          <div className="gllry-controls"><span className="gllry-controls-close">X</span><span className="gllry-controls-left">{"<"}</span><span className="gllry-controls-right">{">"}</span></div>
            {gllryImages}
        </div>
      </div>
    );
  }
}


export default connect(state => ({
  lightbox: state.lightbox
}), Object.assign({}, lightboxActions))(Lightbox);
