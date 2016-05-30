// Vendor
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import Masonry from 'react-masonry-component';
// App Specific
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { lightboxActions } from 'core/lightbox';
import { toastActions } from 'core/toast';
import * as gUtils from './galleriesUtils';
import galleryCategories from './galleryCategories';
import galleryImages from './galleryImages';
import Lightbox from './lightbox';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export class Galleries extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    clearGalleriesToast: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    highlightGalleriesLink: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    showLightbox: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    toggleGalleryDelete: PropTypes.func.isRequired,
    uploadGalleryImage: PropTypes.func.isRequired
  }
  state = {
    gallery: [],
    categories: [],
    currentCategory: '',
    files: [],
    showDeleteHelp: false,
    loadImagesSeq: true
  }
  componentWillMount() {
    this.unbindImagesLoaded = false;
    this.props.highlightGalleriesLink(true);
    this.setGallery(this.props);
  }
  componentDidMount() {
    window.onresize = () => {
      gUtils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    };
    this.loadImagesSeq();
    const { pathname } = this.props.location;
    this.path = gUtils.parsePath(pathname).path;
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    this.path = gUtils.parsePath(pathname).path;
    if (Object.keys(nextProps.galleries.galleries).length > 0) {
      this.setGallery(nextProps);
    }
    if (nextProps.galleries.toast.type) {
      this.props.clearGalleriesToast();
      this.props.showToast(nextProps.galleries.toast);
    }
  }
  componentDidUpdate() {
    this.loadImagesSeq();
  }
  componentWillUnmount() {
    this.props.highlightGalleriesLink(false);
    this.unbindImagesLoaded = true;
    gUtils.unbindImagesLoaded(this.galleryContainer);
    window.onresize = () => {}; // remove listener
  }
  onDrop(files) {
    if (!this.state.isDragReject) {
      this.props.onDropAccept(files); // eslint-disable-line react/prop-types
    }
  }
  onDropAccept = files => {
    this.props.uploadGalleryImage({ files, category: this.path });
  }
  showLightbox = e => {
    e.preventDefault();
    this.props.showLightbox({e, id: e.currentTarget.parentElement.id, scope: this});
    document.querySelector('body').className = 'no-scroll';
  }
  setGallery = props => {
    gUtils.setGallery(props, this); // set current gallery images src
  }
  loadImagesSeq = () => {
    if (this.state.loadImagesSeq) {
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  toggleDeleteHelp = () => {
    this.setState({
      ...this.state,
      showDeleteHelp: !this.state.showDeleteHelp
    });
  }
  render() {
    const { gallery, categories } = this.state;
    const galleryDropZoneClass = classNames({ ['gallery__dropzone_container']: true, ['hidden']: gallery.length < 1 }); // hide dropzone until images loaded
    const galleryDeleteControlsClass = classNames({ ['gallery__delete_controls']: true, ['hidden']: gallery.length < 1 }); // hide dropzone until images loaded
    const galleryHelpMsgClass = classNames({ ['delete__help_message']: true, ['invisible']: !this.state.showDeleteHelp });
    const galleryDeleteMsgClass = classNames({ ['delete__toggle_message']: true, ['invisible']: !this.state.showDeleteHelp });
    const galleryDeleteControls = this.props.auth.authenticated ? (<div className={galleryDeleteControlsClass}>
      <a href="#" className="gallery__delete_reset">Reset</a><i onClick={this.props.toggleGalleryDelete} onMouseEnter={this.toggleDeleteHelp} onMouseLeave={this.toggleDeleteHelp} className="fa fa-trash-o gallery_delete_icon"></i><a href="#" className="gallery_delete_confirm">Delete</a>
    </div>) : null;
    const galleryDropZone = this.props.auth.authenticated ? (<div className={galleryDropZoneClass}>
      <Dropzone className="gallery__dropzone" activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
    </div>) : null;
    return (
      <div className="g-row gallery__container" ref={ref => { this.galleryContainer = ref; }}>
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              {galleryCategories( { categories, props: this.props, path: this.path })}
            </ul>
          </div>
          {galleryDropZone}
          <div className="gallery">
            <Masonry
              ref={ref => { this.masonry = ref; }}
              className={'gallery__masonry'} // default ''
              options={masonryOptions} // default {}
              disableImagesLoaded={false} // default false
              >
                {galleryImages({gallery, scope: this})}
            </Masonry>
          </div>
          <p className={galleryHelpMsgClass}>Select as many images as you'd like to delete. When your done, click the delete button to remove all selected images.</p>
          {galleryDeleteControls}
          <p className={galleryDeleteMsgClass}>Toggle delete mode</p>
          <Lightbox/>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  galleries: state.galleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, galleryActions, lightboxActions, toastActions))(Galleries);
