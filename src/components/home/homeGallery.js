import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import homeGalleryColumns from './homeGalleryColumns';

export class HomeGallery extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired
  }
  render() {
    const { galleries } = this.props.galleries;
    return (
      <div>
        {homeGalleryColumns({galleries, scope: this})}
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, toastActions))(HomeGallery);
