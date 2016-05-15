import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { toastActions } from 'core/toast';
import * as utils from './galleriesUtils';
import galleryCategories from './galleryCategories';
import galleryImages from './galleryImages';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export class Galleries extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }
  state = {
    gallery: [],
    categories: [],
    loadImagesSeq: false
  }
  componentWillMount() {
    this.setGallery(this.props); // set current gallery images src attr
  }
  componentDidMount() {
    window.onresize = () => {
      utils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    };
  }
  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.galleries.galleries).length > 0) {
      this.setGallery(nextProps);
    }
  }
  componentDidUpdate() {
    if (this.state.loadImagesSeq) {
      utils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  componentWillUnmount() {
    window.onresize = () => {}; // remove listener
  }
  setGallery = props => {
    utils.setGallery(props, this);
  }
  render() {
    const { gallery, categories } = this.state;
    return (
      <div className="g-row gallery__container" ref={ref => { this.galleryContainer = ref; }}>
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              {galleryCategories( { categories, props: this.props })}
            </ul>
          </div>
          <div className="gallery">
            <Masonry
              ref={ref => { this.masonry = ref; }}
              className={'gallery__masonry'} // default ''
              options={masonryOptions} // default {}
              disableImagesLoaded={false} // default false
              >
                {galleryImages(gallery)}
            </Masonry>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, toastActions))(Galleries);
