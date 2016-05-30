import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { lightboxActions } from 'core/lightbox';
import * as gUtils from './galleriesUtils';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export default class Gallery extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    galleries: PropTypes.object.isRequired,
    gallery: PropTypes.array.isRequired,
    showGalleryLightbox: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.unbindImagesLoaded = false;
  }
  componentDidMount() {
    this.loadImagesSeq(this.props);
  }
  componentWillUnmount() {
    this.unbindImagesLoaded = true;
    gUtils.unbindImagesLoaded(this.props.galleryContainer);
  }
  componentWillReceiveProps(nextProps) {
    this.loadImagesSeq(nextProps);
  }
  loadImagesSeq = props => {
    const hasGalleryImages = props.gallery.length > 0;
    // compares passed in props to this.props, if there is a difference....loadImagesSeq...this means new img tags have been added to the page
    if (hasGalleryImages) {
       // only need to bind once imgs gallery on dom
      gUtils.seqImagesLoaded(this.props.galleryContainer, this); // show images progressively as they load
    }
  }
  render() {
    const gallery = this.props.gallery;
    const galleryImages = gallery.length > 0 ? gallery.map(element => {
      let cloud;
      if (element.src.includes('cloudinary')) {
        cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
      }
      const src = cloud ? cloud.src : element.src;
      const containerWidth = cloud ? cloud.containerWidth : gUtils.getContainerWidth({type: 'gallery-preview'});
      const masonryClass = 'masonry__image__container';
      const containerClassName = element.show ? masonryClass : `${masonryClass} hide`;
      return element ? (
        <div key={element.id} id={element.id} className={containerClassName} style={{width: `${containerWidth}%` }}>
          <a href="#!" onClick={this.props.showGalleryLightbox}>
            <img src={src} />
          </a>
        </div>
        ) : null;
    }) : null;
    return (
       <Masonry
        ref={ref => { this.masonry = ref; }}
        className={'gallery__masonry'} // default ''
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        >
          {galleryImages}
      </Masonry>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, lightboxActions))(Gallery);
