import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import homeGalleryImages from './homeGalleryImages';

export class Gallery extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired
  }
  render() {
    const { galleries } = this.props.galleries;
    let homeGalleryOne = [];
    let homeGalleryTwo = [];
    const galleryKeys = Object.keys(galleries);
    if (galleryKeys.length > 0) {
      // debugger
    }
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
