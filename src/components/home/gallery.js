import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { authActions } from 'core/auth';

export class Gallery extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    galleries: PropTypes.object.isRequired,
    toggleGalleryEdit: PropTypes.func.isRequired
  }
  editIcon = e => {
    const galleryName = 'homeGallery';
    const id = e.currentTarget.dataset.id;
    const galleryindex = e.currentTarget.dataset.galleryindex;
    this.props.toggleGalleryEdit({id, galleryindex, galleryName});
  }
  editUrl = () => {

  }
  render() {
    const { homeGalleryOne, homeGalleryTwo } = this.props.galleries;
    const { auth } = this.props;
    const editIcon = (galleryindex, id) => { return auth.authenticated ? (<i className="fa fa-pencil-square-o gallery-edit__icon" data-id={id} data-galleryindex={galleryindex} aria-hidden="true" onClick={this.editIcon}></i>) : null; };
    const urlInput = (el, direction, editing) => { return auth.authenticated && editing ? (<div><label className="gallery-url_input-label" htmlFor={`gallery-${direction}-url__input`}>Image Url</label><input id={`gallery-${direction}-url__input`} className="da-editable gallery-url__input" placeholder={el.src} onClick={this.editUrl}/></div>) : null; };
    const imageText = (topText, bottomText, editing) => { return auth.authenticated && editing ? (<div className="gallery-edit__image-text"><input type="text" placeholder={topText}/><span></span><input type="text" placeholder={bottomText}/></div>) : (<div><p>{topText}</p><span></span><p>{bottomText}</p></div>); };
    return (
      <div className="">
        <div className="gallery-left">
          {
            homeGalleryOne.map((element, index) => {
              const elEditIcon = editIcon('one', element.id);
              const elUrlInput = urlInput(element, 'left', element.editing);
              const elImageText = imageText(element.topText, element.bottomText, element.editing);
              return element ? (
                <div key={index} id={element.id} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><div className="overlay__content">
                    {elUrlInput}
                    {elEditIcon}
                    {elImageText}
                  </div></div>
                </div>
              ) : null;
            })
          }
        </div>
        <div className="gallery-right">
          {
            homeGalleryTwo.map((element, index) => {
              const elEditIcon = editIcon('two', element.id);
              const elUrlInput = urlInput(element, 'right', element.editing);
              const elImageText = imageText(element.topText, element.bottomText, element.editing);
              return element ? (
                <div key={index} id={element.id} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><div className="overlay__content">
                    {elUrlInput}
                    {elEditIcon}
                    {elImageText}
                  </div></div>
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
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, galleryActions))(Gallery);
