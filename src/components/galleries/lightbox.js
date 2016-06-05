import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import forIn from 'lodash.forin';
import { lightboxActions } from 'core/lightbox';

export default class Lightbox extends Component {
  static propTypes = {
    lightbox: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwipe: PropTypes.func.isRequired
  }
  onLightboxClick = e => {
    if (e.target.dataset.closelightbox) {
      this.props.onClose(); // detect click off lightbox img to close
    }
  }
  onSwipe = e => {
    this.props.onSwipe({ direction: e.currentTarget.dataset.direction });
  }
  render() {
    const { slides, show } = this.props.lightbox;
    let activeSlideIndex = 0;
    let index = 0;
    const slidesLength = Object.keys(slides).length;
    const lbxclass = 'lbx-container';
    const lightboxClass = show ? `${lbxclass} show` : lbxclass;
    const gllryImages = [];
    if (slidesLength > 0) {
      forIn(slides, slide => {
        const gllryImgClass = 'lbx-img';
        index++;
        if (slide.active) {
          activeSlideIndex = index;
        }
        const imgClass = slide.active ? gllryImgClass : `${gllryImgClass} hide`;
        gllryImages.push((
          <div key={slide.id} className={imgClass}>
            <img src={slide.src}/>
          </div>
        ));
      });
    }
    return (
      <div className={lightboxClass} data-closelightbox="true" onClick={this.onLightboxClick}>
        <div className="lbx-content" data-closelightbox="true">
          <div className="lbx-controls">
            <span className="lbx-slide__counter" data-closelightbox="true">{activeSlideIndex}/{slidesLength}</span>
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

// TODO: <span className="lbx-controls-share fa fa-share"></span>
