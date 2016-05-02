import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';

export class Gallery extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clearToast: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
    submitGalleryImageUpdates: PropTypes.func.isRequired,
    toggleGalleryEdit: PropTypes.func.isRequired
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.galleries.toast.type) {
      this.props.clearToast();
      this.props.showToast(nextProps.galleries.toast);
    }
    const galleriesReady = nextProps.galleries.homeGalleryOne.length >= 1 && nextProps.galleries.homeGalleryTwo >= 1 ? true : false;
    debugger
    if (galleriesReady) {
      this.setImageDimensions(500);
    }
  }
  setImageDimensions = () => {
    debugger
  }
  onEditIconClick = e => {
    const galleryName = 'homeGallery';
    const id = e.currentTarget.parentElement.id;
    const galleryindex = e.currentTarget.parentElement.dataset.gallery;
    this.props.toggleGalleryEdit({id, galleryindex, galleryName});
  }
  editImageText = e => {
    const key = e.which || e.keyCode || 0;
    if (key === 13) {
      const id = e.currentTarget.parentElement.parentElement.id;
      const galleryindex = e.currentTarget.parentElement.parentElement.dataset.gallery;
      const text = e.currentTarget.value;
      const position = e.currentTarget.dataset.position;
      this.props.submitGalleryImageUpdates({id, galleryindex, text, position});
    }
  }
  editUrl = e => {
    const key = e.which || e.keyCode || 0;
    if (key === 13) {
      const id = e.currentTarget.parentElement.parentElement.id;
      const galleryindex = e.currentTarget.parentElement.parentElement.dataset.gallery;
      const newImageUrl = e.currentTarget.value;
      this.props.submitGalleryImageUpdates({id, galleryindex, newImageUrl});
    }
  }
  render() {
    const { admin } = this.props;
    const { homeGalleryOne, homeGalleryTwo } = this.props.galleries;
    const { auth } = this.props;
    const editIcon = () => { return auth.authenticated ? (<i className="fa fa-pencil-square-o gallery-edit__icon" aria-hidden="true" onClick={this.onEditIconClick}></i>) : null; };
    const urlInput = (el, direction, editing) => { return auth.authenticated && editing ? (<div><label className="gallery-url_input-label" htmlFor={`gallery-${direction}-url__input`}>Image Url</label><input id={`gallery-${direction}-url__input`} className="da-editable gallery-url__input" placeholder={el.src} onKeyUp={this.editUrl}/></div>) : null; };
    const imageText = (topText, bottomText, editing) => { return auth.authenticated && editing ? (<div className="gallery-edit__image-text"><input type="text" placeholder={topText} data-position="top" onKeyUp={this.editImageText}/><span></span><input type="text" placeholder={bottomText} onKeyUp={this.editImageText} data-position="bottom"/></div>) : (<div><p className="gallery-image-text">{topText}</p><span></span><p className="gallery-image-text">{bottomText}</p></div>); };
    const placeholderImage = auth.authenticated ? (<div className="image__container gallery-edit__image-placeholder"><input type="text" placeholder="topText" data-position="top" onKeyUp={this.editImageText}/><span></span><input type="text" placeholder="bottomText" onKeyUp={this.editImageText} data-position="bottom"/></div>) : null;
    return (
      <div className="">
        <div className="gallery-left">
          {
            homeGalleryOne.map((element, index) => {
              let match = null;
              if (admin.pendingUpdatesRaw.homeGalleryOne) {
                match = admin.pendingUpdatesRaw.homeGalleryOne[element.id] ? admin.pendingUpdatesRaw.homeGalleryOne[element.id] : undefined;
              }
              const src = match ? match.src : element.src;
              const topText = match ? match.topText : element.topText;
              const bottomText = match ? match.bottomText : element.bottomText;
              const elEditIcon = editIcon();
              const elUrlInput = urlInput(element, 'left', element.editing);
              const elImageText = imageText(topText, bottomText, element.editing);
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-left-${index}`] = ref; }} >
                  <img src={src} />
                  <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryOne">
                    {elUrlInput}
                    {elEditIcon}
                    {elImageText}
                  </div></div>
                </div>
              ) : null;
            })
          }
          {placeholderImage}
        </div>
        <div className="gallery-right">
          {
            homeGalleryTwo.map((element, index) => {
              let match = null;
              if (admin.pendingUpdatesRaw.homeGalleryTwo) {
                match = admin.pendingUpdatesRaw.homeGalleryTwo[element.id] ? admin.pendingUpdatesRaw.homeGalleryTwo[element.id] : undefined;
              }
              const src = match ? match.src : element.src;
              const topText = match ? match.topText : element.topText;
              const bottomText = match ? match.bottomText : element.bottomText;
              const elEditIcon = editIcon();
              const elUrlInput = urlInput(element, 'right', element.editing);
              const elImageText = imageText(topText, bottomText, element.editing);
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-right-${index}`] = ref; }}>
                  <img src={src} />
                  <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryTwo">
                    {elUrlInput}
                    {elEditIcon}
                    {elImageText}
                  </div></div>
                </div>
              ) : null;
            })
          }
          {placeholderImage}
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
