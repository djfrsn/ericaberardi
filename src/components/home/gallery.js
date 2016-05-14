import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
// import galleryImageContainer from './galleryImageContainer';

export class Gallery extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clearImageResetMeta: PropTypes.func.isRequired,
    clearToast: PropTypes.func.isRequired,
    createPlaceholderImages: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    saveGalleryImage: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    submitGalleryImageUpdates: PropTypes.func.isRequired,
    toggleGalleryEdit: PropTypes.func.isRequired
  }
  render() {
    const { homeGalleryOne, homeGalleryTwo } = this.props.galleries;
    const imageText = category => { return (<div><p className="gallery-image-text">{category}</p></div>); };
    return (
      <div className="">
        <div className="gallery-left">
          {
            homeGalleryOne.map((element, index) => {
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-left-${index}`] = ref; }} >
                  <img src={element.src} />
                  <Link to={element.category.toLowerCase()} className="gallery__link" >
                    <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryOne">
                      {imageText(element.category)}
                    </div></div>
                  </Link>
                </div>
              ) : null;
            })
          }
        </div>
        <div className="gallery-right">
          {
            homeGalleryTwo.map((element, index) => {
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-right-${index}`] = ref; }}>
                  <img src={element.src} />
                  <Link to={element.category.toLowerCase()} className="gallery__link" >
                    <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryTwo">
                      {imageText(element.category)}
                    </div></div>
                  </Link>
                </div>
              ) : null;
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, toastActions))(Gallery);
