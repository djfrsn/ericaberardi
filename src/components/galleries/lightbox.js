import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import forIn from 'lodash.forin';
import { lightboxActions } from 'core/lightbox';
import Hammer from 'hammerjs';

export default class Lightbox extends Component {
  static propTypes = {
    closeLightbox: PropTypes.func.isRequired,
    lightbox: PropTypes.object.isRequired,
    onSwipe: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.registerHammer();
    document.addEventListener( 'keydown', this.listenToKeyPress );
  }
  componentWillUnmount() {
    this.registerHammer = null;
    document.removeEventListener( 'keydown', this.listenToKeyPress );
  }
  onLightboxClick = e => {
    if (e.target.dataset.closelightbox) {
      this.props.closeLightbox(); // detect click off lightbox img to close
    }
  }
  listenToKeyPress = e => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 37) {
      this.onSwipe({direction: 4});
    } // pass fake hammer event 4 = left, 2 = right
    else if (keyCode === 39) {
      this.onSwipe({direction: 2});
    }
    else if (keyCode === 27) {
      this.props.closeLightbox();
    }
  }
  registerHammer = () => {
    this.hammertime = new Hammer(this.lightbox);
    this.hammertime.on('swipe', this.onSwipe);
  }
  onSwipe = e => {
    const swipeEvent = e.direction;
    const swipeDirection = e.direction === Hammer.DIRECTION_LEFT ? 'right' : 'left';
    const direction = !swipeEvent ? e.currentTarget.dataset.direction : swipeDirection;
    this.props.onSwipe({ direction: direction });
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
      <div className={lightboxClass} data-closelightbox="true" ref={ref => this.lightbox = ref} onClick={this.onLightboxClick}>
        <div className="lbx-content" data-closelightbox="true">
          <div className="lbx-controls">
            <span className="lbx-slide__counter" data-closelightbox="true">{activeSlideIndex}/{slidesLength}</span>
            <span onClick={this.props.closeLightbox} className="lbx-controls-close fa fa-times"></span>
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
