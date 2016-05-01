import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { galleryActions } from 'core/galleries';
import { authActions } from 'core/auth';

export class Gallery extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }
  editIcon = () => {

  }
  editUrl = () => {

  }
  render() {
    const { homeGallery } = this.props.galleries;
    const { auth } = this.props;
    const editIcon = auth.authenticated ? (<i className="fa fa-pencil-square-o gallery-edit__icon" aria-hidden="true" onClick={this.editIcon}></i>) : null;
    return (
      <div className="">
        <div className="gallery-left">
          {
            homeGallery['0'].map((element, index) => {
              const urlInput = auth.authenticated ? (<div><label className="gallery-url_input-label" htmlFor="gallery-left-url__input">Image Url</label><input id="gallery-left-url__input" className="da-editable gallery-url__input" placeholder={element.src} onClick={this.editUrl}/></div>) : null;
              return element ? (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><div className="overlay__content">
                    {urlInput}
                    {editIcon}
                    <p>{element.topText}</p><span></span><p>{element.bottomText}</p>
                  </div></div>
                </div>
              ) : null;
            })
          }
        </div>
        <div className="gallery-right">
          {
            homeGallery['1'].map((element, index) => {
              const urlInput = auth.authenticated ? (<div><label className="gallery-url_input-label" htmlFor="gallery-right-url__input">Image Url</label><input id="gallery-right-url__input" className="da-editable gallery-url__input" placeholder={element.src} onClick={this.editUrl}/></div>) : null;
              return element ? (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><div className="overlay__content">
                    {urlInput}
                    {editIcon}
                    <p>{element.topText}</p><span></span><p>{element.bottomText}</p>
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
