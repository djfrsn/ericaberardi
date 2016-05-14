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
    gallery: []
  }
  componentWillMount() {
    this.loadGallery(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.loadGallery(nextProps);
  }
  loadGallery = props => {
    const { pathname } = props.location;
    const path = utils.parsePath(pathname).path;
    const defaultGallery = 'commercial';
    const galleryPath = path === '/' ? defaultGallery : path;
    const galleries = props.galleries.galleries;
    const gallery = props.galleries.galleries[galleryPath] || {};

    if (Object.keys(galleries).length > 0) {
      this.setState({ gallery });
      // set route to gallery_path
    }
  }
  reRender = () => {
    this.forceUpdate(); // ugly hack since activeClassName only works on page refresh
  }
  render() {
    const { gallery } = this.state;
    return (
      <div className="g-row gallery__container">
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              <li><Link to="/galleries/commercial" className="gallery__link" onClick={this.reRender} activeClassName="active">Commercial</Link></li>
              <li><Link to="/galleries/families" className="gallery__link" onClick={this.reRender} activeClassName="active">Families</Link></li>
              <li><Link to="/galleries/portraits" className="gallery__link" onClick={this.reRender} activeClassName="active">Portraits</Link></li>
              <li><Link to="/galleries/events" className="gallery__link" onClick={this.reRender} activeClassName="active">Events</Link></li>
              <li><Link to="/galleries/sports" className="gallery__link" onClick={this.reRender} activeClassName="active">Sports</Link></li>
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
