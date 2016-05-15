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
    categories: []
  }
  componentWillMount() {
    this.setGallery(this.props); // set current gallery images src attr
  }
  componentDidMount() {
    utils.seqImagesLoaded(this.galleryContainer); // show images progressively as they load
    window.onresize = () => {
      utils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setGallery(nextProps);
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
