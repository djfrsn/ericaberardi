import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { toastActions } from 'core/toast';
import * as utils from './galleriesUtils';
// TODO: Import galleryImageContainer
// import galleryImageContainer from './galleryImageContainer';

export class Galleries extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }
  state = {
    gallery: [],
    categories: []
  }
  componentWillMount() {
    this.setGallery(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.setGallery(nextProps);
  }
  setGallery = props => {
    const { pathname } = props.location;
    const path = utils.parsePath(pathname).path;
    const defaultGallery = 'commercial';
    const galleryPath = path === '/' ? defaultGallery : path;
    const galleries = props.galleries.galleries;
    const gallery = props.galleries.galleries[galleryPath] || {};
    const categories = Object.keys(galleries);

    if (categories.length > 0) {
      this.setState({ categories, gallery });
    }
  }
  render() {
    const { gallery, categories } = this.state;
    return (
      <div className="g-row gallery__container">
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
            {
              categories.map((category, index) => {
                const { pathname } = this.props.location;
                const path = utils.parsePath(pathname).path;
                const galleryLink = 'gallery__link';
                const className = (path === '/' ? 'commercial' : path) === category ? `${galleryLink} active` : galleryLink;
                return category ? (
                  <li key={index}><Link to={`/galleries/${category}`} className={className}>{category}</Link></li>
                ) : null;
              })
            }
            </ul>
          </div>
          <div className="gallery">
          {
            gallery.map((element, index) => {
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-img-${index}`] = ref; }} >
                  <img src={element.src} />
                  <div className="overlay">
                    <div className="overlay__content" id={element.id} data-gallery="mainGallery"></div>
                  </div>
                </div>
              ) : null;
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, toastActions))(Galleries);
