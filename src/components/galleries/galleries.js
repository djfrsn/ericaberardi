// Vendor
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
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
    tagImgForDeletion: PropTypes.func.isRequired,
    uploadGalleryImage: PropTypes.func.isRequired
  }
  state = {
    gallery: [],
    categories: [],
    files: [],
    galleryDeleteEnabled: false,
    showDeleteToggleMsg: false,
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
    this.path = gUtils.parsePath(pathname).path; // stores currentCategory
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
    const lbxDisabled = Array.indexOf(e.currentTarget.classList, 'lbx-disabled') >= 0;
    if (!lbxDisabled) {
      this.props.showLightbox({e, id: e.currentTarget.parentElement.id, scope: this});
      document.querySelector('body').className = 'no-scroll';
    }
    else if (this.state.galleryDeleteEnabled) {
      const imageId = e.currentTarget.parentElement.id;
      this.props.tagImgForDeletion({imageId, category: this.path });
    }
  }
  setGallery = props => {
    gUtils.setGallery(props, this); // set current gallery images src
  }
  loadImagesSeq = () => {
    if (this.state.loadImagesSeq) {
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  onToggleGalleryDelete = e => {
    e.preventDefault();
    this.setState({
      ...this.state,
      galleryDeleteEnabled: !this.state.galleryDeleteEnabled
    });
    // this.props.toggleGalleryDelete();
  }
  toggleDeleteHelp = () => {
    this.setState({
      ...this.state,
      showDeleteToggleMsg: !this.state.showDeleteToggleMsg
    });
  }
  render() {
    // delete strategy
    // disable lightbox
    // on img click if delete mode enabled set galleries img id to delete & save this state to db
    // use delete prop to give red b order to any images selected for deletion
    // on delete/reset show sweet alert prompt
    const { gallery, categories } = this.state;
    const galleryDropZoneClass = cn({ ['gallery__dropzone_container']: true, ['hidden']: gallery.length < 1 }); // hide dropzone until images loaded
    const galleryDeleteControlsClass = cn({ ['gallery__delete_controls']: true, ['hidden']: gallery.length < 1 }); // hide dropzone until images loaded
    const galleryDeleteToggle = !this.state.galleryDeleteEnabled;
    const galleryHelpMsgClass = cn({ ['delete__help_message']: true, ['invisible']: galleryDeleteToggle });
    const galleryDeleteMsgClass = cn({ ['delete__toggle_message']: true, ['invisible']: !this.state.showDeleteToggleMsg });
    const galleryDeleteControls = this.props.auth.authenticated ? (<div className={galleryDeleteControlsClass}>
      <a href="#!" className={cn({ ['gallery__delete_reset']: true, ['invisible']: galleryDeleteToggle })}>Reset</a>
      <a href="#!" onClick={this.onToggleGalleryDelete} onMouseEnter={this.toggleDeleteHelp} onMouseLeave={this.toggleDeleteHelp}>
        <i className="fa fa-trash-o gallery_delete_icon"></i>
      </a>
      <a href="#!" className={cn({ ['gallery_delete_confirm']: true, ['invisible']: galleryDeleteToggle })}>Delete</a>
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
              {galleryCategories( { categories, props: this.props, category: this.path })}
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
          <p className={galleryHelpMsgClass}>Select any images you'd like to delete. When your done, click the delete button to remove all selected images.</p>
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
