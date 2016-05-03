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
    createPlaceholderImages: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    saveGalleryImage: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    submitGalleryImageUpdates: PropTypes.func.isRequired,
    toggleGalleryEdit: PropTypes.func.isRequired
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.galleries.toast.type) {
      this.props.clearToast();
      this.props.showToast(nextProps.galleries.toast);
    }
    const galleriesReady = nextProps.galleries.homeGalleryOne.length >= 1 && nextProps.galleries.homeGalleryTwo.length >= 1 && nextProps.galleries.placeholderImages.length !== 2 ? true : false;
    if (galleriesReady ) {
      this.setImageDimensions(750); // delay to allow images time to load
    }
  }
  setImageDimensions = (delay = 0) => {
    setTimeout(() => {
      const imageOne = this['gallery-left-0'];
      const imageTwo = this['gallery-right-0'];
      this.props.createPlaceholderImages([{
        direction: 'left',
        height: imageOne.clientHeight,
        width: imageOne.clientWidth
      }, {
        direction: 'right',
        height: imageTwo.clientHeight,
        width: imageTwo.clientWidth
      }]);
    }, delay);
  }
  onSaveIconClick = e => {
    const galleryName = 'homeGallery';
    const galleryindex = e.currentTarget.parentElement.parentElement.dataset.gallery;
    const src = this[`placeholder-image-${galleryindex}-src`].value;
    const topText = this[`placeholder-image-${galleryindex}-topText`].value;
    const bottomText = this[`placeholder-image-${galleryindex}-bottomText`].value;
    this.props.saveGalleryImage({galleryindex, galleryName, src, topText, bottomText});
  }
  onEditIconClick = e => {
    const galleryName = 'homeGallery';
    const id = e.currentTarget.parentElement.id;
    const galleryindex = e.currentTarget.parentElement.dataset.gallery;
    this.props.toggleGalleryEdit({id, galleryindex, galleryName});
  }
  isPlaceholderEl = e => {
    return e.currentTarget.parentElement.parentElement.dataset.placeholder === 'true' ? true : false;
  }
  editImageText = e => {
    const key = e.which || e.keyCode || 0;
    if (key === 13 && !this.isPlaceholderEl(e)) {
      const id = e.currentTarget.parentElement.parentElement.id;
      const galleryindex = e.currentTarget.parentElement.parentElement.dataset.gallery;
      const text = e.currentTarget.value;
      const position = e.currentTarget.dataset.position;
      this.props.submitGalleryImageUpdates({id, galleryindex, text, position});
    }
  }
  editUrl = e => {
    const key = e.which || e.keyCode || 0;
    if (key === 13 && !this.isPlaceholderEl(e)) {
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
    const saveIcon = () => { return auth.authenticated ? (<i className="fa fa-check-square-o gallery-edit__icon" aria-hidden="true" onClick={this.onSaveIconClick}></i>) : null; };
    const editIcon = () => { return auth.authenticated ? (<i className="fa fa-pencil-square-o gallery-edit__icon" aria-hidden="true" onClick={this.onEditIconClick}></i>) : null; };
    const urlInput = (el, direction, editing, attr = '') => { return auth.authenticated && editing ? (<div><label className="gallery-url_input-label" htmlFor={`gallery-${direction}-url__input`}>Image Url</label><input id={`gallery-${direction}-url__input`} className="da-editable gallery-url__input" ref={ref => { this[attr] = ref; }} placeholder={el.src} onKeyUp={this.editUrl}/></div>) : null; };
    const imageText = (topText, bottomText, editing, attr = '') => { return auth.authenticated && editing ? (<div className="gallery-edit__image-text"><input type="text" ref={ref => { this[`${attr}-topText`] = ref; }} placeholder={topText} data-position="top" onKeyUp={this.editImageText}/><span></span><input type="text" ref={ref => { this[`${attr}-bottomText`] = ref; }} placeholder={bottomText} onKeyUp={this.editImageText} data-position="bottom"/></div>) : (<div><p className="gallery-image-text">{topText}</p><span></span><p className="gallery-image-text">{bottomText}</p></div>); };
    const placeholderImages = auth.authenticated && this.props.galleries.placeholderImages.length >= 2 ?
    this.props.galleries.placeholderImages.map((image, index) => {
      const galleryindex = index === 0 ? 'homeGalleryOne' : 'homeGalleryTwo';
      const elUrlInput = urlInput({src: 'Replace w/ img url and click checkmark!'}, image.direction, true, `placeholder-image-${galleryindex}-src`);
      const elImageText = imageText('topText', 'bottomText', true, `placeholder-image-${galleryindex}`);
      return (<div key={index} data-gallery={galleryindex} className="image__container gallery-edit__image-placeholder" style={{height: image.height, width: image.width }}><div className="overlay__content" data-placeholder="true">{elUrlInput}{saveIcon()}{elImageText}</div></div>);
    }) : null;
    const placeholderImageOne = placeholderImages ? placeholderImages[0] : null;
    const placeholderImageTwo = placeholderImages ? placeholderImages[1] : null;
    return (
      <div className="">
        <div className="gallery-left">
          {
            homeGalleryOne.map((element, index) => {
              let match = null;
              if (admin.pendingUpdatesRaw.homeGalleryOne) {
                match = admin.pendingUpdatesRaw.homeGalleryOne[element.id] ? admin.pendingUpdatesRaw.homeGalleryOne[element.id] : null;
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
          {placeholderImageOne}
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
          {placeholderImageTwo}
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
