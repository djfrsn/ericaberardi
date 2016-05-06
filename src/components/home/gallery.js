import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import galleryImageContainer from './galleryImageContainer';

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
      this.props.submitGalleryImageUpdates({id, galleryindex, text, position, type: 'text'});
    }
  }
  editUrl = e => {
    const key = e.which || e.keyCode || 0;
    if (key === 13 && !this.isPlaceholderEl(e)) {
      const id = e.currentTarget.parentElement.parentElement.id;
      const galleryindex = e.currentTarget.parentElement.parentElement.dataset.gallery;
      const newImageUrl = e.currentTarget.value;
      this.props.submitGalleryImageUpdates({id, galleryindex, newImageUrl, type: 'url'});
    }
  }
  render() {
    const { admin } = this.props;
    const { homeGalleryOne, homeGalleryTwo } = this.props.galleries;
    const { auth } = this.props;
    const editIcon = () => { return auth.authenticated ? (<i className="fa fa-pencil-square-o gallery-edit__icon" aria-hidden="true" onClick={this.onEditIconClick}></i>) : null; };
    const urlInput = (el, direction, editing) => { return auth.authenticated && editing ? (<div><label className="gallery-url_input-label" htmlFor={`gallery-${direction}-url__input`}>Image Url</label><input id={`gallery-${direction}-url__input`} className="da-editable gallery-url__input" ref={ref => { this[`urlInput-${el.id}`] = ref; }} placeholder={el.src} onKeyUp={this.editUrl}/></div>) : null; };
    const imageText = category => { return (<div><p className="gallery-image-text">{category}</p></div>); };
    let pendingNewImagesOne = null;
    let pendingNewImagesTwo = null;
    if (admin.pendingUpdatesRaw.homeGalleryOne) {
      pendingNewImagesOne = [];
      let i = 0;
      const pendingHomeGalleryOne = admin.pendingUpdatesRaw.homeGalleryOne;
      for (let key in pendingHomeGalleryOne) {
        if (pendingHomeGalleryOne.hasOwnProperty(key)) {
          let element = pendingHomeGalleryOne[key];
          pendingNewImagesOne.push(galleryImageContainer({
            element,
            gallery: 'homeGalleryOnePending',
            src: element.src,
            index: i++,
            direction: 'left',
            elUrlInput: urlInput(element, 'left', element.editing),
            elEditIcon: editIcon(),
            elImageText: imageText(element.topText)
          }));
        }
      }
    }
    if (admin.pendingUpdatesRaw.homeGalleryTwo) {
      pendingNewImagesTwo = [];
      let h = 0;
      const pendingHomeGalleryTwo = admin.pendingUpdatesRaw.homeGalleryTwo;
      for (let key in pendingHomeGalleryTwo) {
        if (pendingHomeGalleryTwo.hasOwnProperty(key)) {
          let element = pendingHomeGalleryTwo[key];
          pendingNewImagesTwo.push(galleryImageContainer({
            element,
            gallery: 'homeGalleryTwoPending',
            src: element.src,
            index: h++,
            direction: 'right',
            elUrlInput: urlInput(element, 'right', element.editing),
            elEditIcon: editIcon(),
            elImageText: imageText(element.topText)
          }));
        }
      }
    }
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
              const elImageText = imageText(topText);
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-left-${index}`] = ref; }} >
                  <img src={src} />
                  <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryOne">
                    {elImageText}
                  </div></div>
                </div>
              ) : null;
            })
          }
          {pendingNewImagesOne}
        </div>
        <div className="gallery-right">
          {
            homeGalleryTwo.map((element, index) => {
              let match = null;
              if (admin.pendingUpdatesRaw.homeGalleryTwo) {
                match = admin.pendingUpdatesRaw.homeGalleryTwo[element.id] ? admin.pendingUpdatesRaw.homeGalleryTwo[element.id] : null;
              }
              const src = match ? match.src : element.src;
              const topText = match ? match.topText : element.topText;
              const elImageText = imageText(topText);
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-right-${index}`] = ref; }}>
                  <img src={src} />
                  <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="homeGalleryTwo">
                    {elImageText}
                  </div></div>
                </div>
              ) : null;
            })
          }
          {pendingNewImagesTwo}
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
