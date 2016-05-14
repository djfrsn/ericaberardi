import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { toastActions } from 'core/toast';
// TODO: Import galleryImageContainer
// import galleryImageContainer from './galleryImageContainer';

export class Galleries extends Component {
  static propTypes = {
    galleries: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }
  loadGallery = pathname => {
    return pathname;
  }
  reRender = () => {
    this.forceUpdate(); // ugly hack since activeClassName only works on page refresh
  }
  render() {
    const { galleries } = this.props.galleries;
    const imageText = category => { return (<div><p className="gallery-image-text">{category}</p></div>); };
    return (
      <div className="g-row gallery__container">
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              <li><Link to="galleries" className="gallery__link" onClick={this.reRender} activeClassName="active">Commercial</Link></li>
              <li><Link to="news-reporting" className="gallery__link" onClick={this.reRender} activeClassName="active">Families</Link></li>
              <li><Link to="pricing" className="gallery__link" onClick={this.reRender} activeClassName="active">Portraits</Link></li>
              <li><Link to="about" className="gallery__link" onClick={this.reRender} activeClassName="active">Events</Link></li>
              <li><Link to="contact" className="gallery__link" onClick={this.reRender} activeClassName="active">Sports</Link></li>
            </ul>
          </div>
          <div className="gallery">
          {
            galleries.map((element, index) => {
              return element ? (
                <div key={index} id={element.id} className="image__container" ref={ref => { this[`gallery-left-${index}`] = ref; }} >
                  <img src={element.src} />
                  <Link to={`galleries/${element.category.toLowerCase()}`} className="gallery__link" >
                    <div className="overlay"><div className="overlay__content" id={element.id} data-gallery="mainGallery">
                      {imageText(element.category)}
                    </div></div>
                  </Link>
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
