import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import homeGalleryImages from './homeGalleryImages';

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
    return (
      <div className="">
        <div className="gallery-left">
          {homeGalleryImages({gallery: homeGalleryOne, direction: 'left', galleryName: 'homeGalleryOne', scope: this})}
        </div>
        <div className="gallery-right">
          {homeGalleryImages({gallery: homeGalleryTwo, direction: 'left', galleryName: 'homeGalleryTwo', scope: this})}
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
