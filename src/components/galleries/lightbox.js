import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { lightboxActions } from 'core/lightbox';
import * as gUtils from './galleriesUtils';

export default class Lightbox extends Component {
  static propTypes = {
    lightbox: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwipe: PropTypes.func.isRequired
  }
  onSwipe = e => {
    this.props.onSwipe({ direction: e.currentTarget.dataset.direction });
  }
  render() {
    const { slides, show } = this.props.lightbox;
    let activeSlideIndex = 0;
    const lbxclass = 'lbx-container';
    const lightboxClass = show ? `${lbxclass} show` : lbxclass;
    const gllryImages = slides.length > 0 ? slides.map((slide, key) => {
      const cloud = gUtils.cloudinaryTransform({ type: 'gallery-expanded', src: slide.src }) || {};
      const gllryImgClass = 'lbx-img';
      if (slide.active) activeSlideIndex = key + 1;
      const imgClass = slide.active ? gllryImgClass : `${gllryImgClass} hide`;
      return (
        <div key={slide.id} className={imgClass}>
          <img src={cloud.src}/>
        </div>
      );
    }) : null;
    return (
      <div className={lightboxClass}>
        <div className="lbx-content">
          <div className="lbx-controls">
            <span className="lbx-slide__counter">{activeSlideIndex}/{slides.length}</span>
            <span className="lbx-controls-share fa fa-share"></span>
            <span onClick={this.props.onClose} className="lbx-controls-close fa fa-times"></span>
            <span onClick={this.onSwipe} data-direction="left" className="lbx-controls-left fa fa-arrow-left"></span>
            <span onClick={this.onSwipe} data-direction="right" className="lbx-controls-right fa fa-arrow-right"></span>
          </div>
            {gllryImages}
        </div>
      </div>
    );
  }
}


export default connect(state => ({
  lightbox: state.lightbox
}), Object.assign({}, lightboxActions))(Lightbox);
