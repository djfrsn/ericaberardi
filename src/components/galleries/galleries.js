import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { lightboxActions } from 'core/lightbox';
import { toastActions } from 'core/toast';
import * as gUtils from './galleriesUtils';
import galleryCategories from './galleryCategories';
import galleryImages from './galleryImages';
import Lightbox from './lightbox';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export class Galleries extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    galleries: PropTypes.object.isRequired,
    highlightGalleriesLink: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    showLightbox: PropTypes.func.isRequired
  }
  state = {
    gallery: [],
    categories: [],
    loadImagesSeq: true
  }
  componentWillMount() {
    this.props.highlightGalleriesLink(true);
    this.setGallery(this.props);
  }
  componentDidMount() {
    window.onresize = () => {
      gUtils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    };
    this.loadImagesSeq();
  }
  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.galleries.galleries).length > 0) {
      this.setGallery(nextProps);
    }
  }
  componentDidUpdate() {
    this.loadImagesSeq();
  }
  componentWillUnmount() {
    this.props.highlightGalleriesLink(false);
    window.onresize = () => {}; // remove listener
  }
  showLightbox = e => {
    e.preventDefault();
    this.props.showLightbox({e, id: e.currentTarget.parentElement.id, scope: this});
  }
  setGallery = props => {
    gUtils.setGallery(props, this); // set current gallery images src attr
  }
  loadImagesSeq = () => {
    if (this.state.loadImagesSeq) {
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
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
                {galleryImages({gallery, scope: this})}
            </Masonry>
          </div>
          <Lightbox/>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, lightboxActions, toastActions))(Galleries);
