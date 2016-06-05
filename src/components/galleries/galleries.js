// Vendor
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import Dropzone from 'react-dropzone';
import Masonry from 'react-masonry-component';
import deepEqual from 'deep-equal';
// App Specific
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleriesActions } from 'core/galleries';
import { lightboxActions } from 'core/lightbox';
import { toastActions } from 'core/toast';
import { deleteImagesAlert } from './galleriesAlerts';
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
    createCategory: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    highlightGalleriesLink: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onGalleryDeleteImages: PropTypes.func.isRequired,
    resetTaggedForGalleryDelete: PropTypes.func.isRequired,
    sendGalleriesToast: PropTypes.func.isRequired,
    showLightbox: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    tagImgForDeletion: PropTypes.func.isRequired,
    toggleGalleryDelete: PropTypes.func.isRequired,
    uploadGalleryImage: PropTypes.func.isRequired
  }
  state = {
    gallery: {},
    categories: {},
    files: [],
    showDeleteToggleMsg: false,
    loadImagesSeq: true
  }
  componentWillMount() {
    this.unbindImagesLoaded = false;
    this.props.highlightGalleriesLink(true);
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
    const galleriesPathname = this.galleriesPathname;
    this.path = gUtils.parsePath(pathname).path;

    const routeChange = pathname !== galleriesPathname || pathname === '/galleries';
    const galleryChange = !deepEqual(nextProps.galleries.images, this.props.galleries.images) || !deepEqual(nextProps.galleries['pending-galleries'], this.props.galleries['pending-galleries']);

    if (routeChange || galleryChange) {
      this.galleriesPathname = pathname; // update active gallery on route/gallersState change
      this.hydrateActiveGallery(nextProps, this);
    }
    if (nextProps.galleries.toast.type) {
      this.props.clearGalleriesToast();
      this.props.showToast(nextProps.galleries.toast);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEqual(this.props, nextProps);
    const stateChanged = !deepEqual(this.state, nextState);
    return propsChanged || stateChanged; // rerender on prop/state change
  }
  componentDidUpdate() {
    this.loadImagesSeq();
  }
  componentWillUnmount() {
    this.props.highlightGalleriesLink(false);
    this.unbindImagesLoaded = true;
    this.galleriesPathname = '';
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
  onImageClick = e => {
    e.preventDefault();
    const lbxDisabled = Array.indexOf(e.currentTarget.classList, 'lbx-disabled') >= 0;
    if (!lbxDisabled) {
      this.props.showLightbox({e, id: e.currentTarget.parentElement.id, scope: this});
      document.querySelector('body').className = 'no-scroll';
    }
    else if (this.props.galleries.galleryDeleteEnabled) { // Tag images for delection
      const imageId = e.currentTarget.parentElement.id;
      this.props.tagImgForDeletion({imageId, category: this.path });
    }
  }
  hydrateActiveGallery = props => {
    gUtils.hydrateActiveGallery(props, this); // set current gallery images src
  }
  loadImagesSeq = () => {
    if (this.props.galleries.seqImagesLoadedEnabled) { // enabled/disabled to prevent over binding
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  onGalleryDeleteReset = e => {
    e.preventDefault();
    if (this.props.galleries.taggedForDeleteCount > 0) {
      this.props.resetTaggedForGalleryDelete();
    }
  }
  onToggleGalleryDelete = e => {
    e.preventDefault();
    this.props.toggleGalleryDelete();
    if (this.props.galleries.galleryDeleteEnabled) {
      this.props.resetTaggedForGalleryDelete(); // reset taggedgalleries on toggle off
    }
  }
  onDeleteImages = () => {
    if (this.props.galleries.taggedForDeleteCount > 0) {
      deleteImagesAlert(this);
    }
    else {
      this.props.sendGalleriesToast({
        firstLine: 'Error!',
        secondLine: 'Select images to delete and try again.',
        type: 'error'
      });
    }
  }
  onCreateCategory = e => {
    e.preventDefault();
    this.props.createCategory(this.newCategory.value);
    this.newCategory.value = '';
  }
  toggleDeleteHelp = () => {
    this.setState({
      ...this.state,
      showDeleteToggleMsg: !this.state.showDeleteToggleMsg
    });
  }
  render() {
    const { gallery, categories } = this.state;
    const authenticated = this.props.auth.authenticated;
    const galleriesLength = Object.keys(this.props.galleries.categories).length;
    const taggedForDeleteCount = this.props.galleries.taggedForDeleteCount;
    const char = taggedForDeleteCount > 1 ? '\'s' : '';
    const dropZoneTitleClass = cn({ ['gallery__dropzone_title']: true, ['hidden']: galleriesLength < 1 }); // hide dropzone until images loaded
    const galleryAddCategoryClass = cn({ ['gallery__add_category_container']: true, ['hidden']: galleriesLength < 1 }); // hide dropzone until images loaded
    const galleryDropZoneClass = cn({ ['gallery__dropzone_container']: true, ['hidden']: galleriesLength < 1 }); // hide dropzone until images loaded
    const galleryDeleteControlsClass = cn({ ['gallery__delete_controls']: true, ['hidden']: galleriesLength < 1 }); // hide dropzone until images loaded
    const galleryDeleteToggle = !this.props.galleries.galleryDeleteEnabled;
    const galleryHelpMsgClass = cn({ ['delete__help_message']: true, ['invisible']: galleryDeleteToggle });
    const galleryDeleteMsgClass = cn({ ['delete__toggle_message']: true, ['invisible']: !this.state.showDeleteToggleMsg });
    const addCategory = authenticated ? (<div className={galleryAddCategoryClass}>
      <form onSubmit={this.onCreateCategory}>
        <p>Create</p>
        <input type="text" placeholder="New Category" ref={ref => this.newCategory = ref}/>
        <button type="submit" onClick={this.onCreateCategory}>Submit</button>
      </form>
    </div>) : null;
    const galleryDropZone = authenticated ? (<div className={galleryDropZoneClass}>
      <Dropzone className="gallery__dropzone" activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
    </div>) : null;
    return (
      <div className="g-row gallery__container" ref={ref => { this.galleryContainer = ref; }}>
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              {galleryCategories( { categories, props: this.props, category: this.path, scope: this })}
            </ul>
          </div>
          {addCategory}
          {authenticated ? (<h2 className={dropZoneTitleClass}>Upload Files</h2>) : null}
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
          {authenticated ? (<div>
            <p className={galleryHelpMsgClass}>Select any images you'd like to delete. When your done, click the delete button to remove all selected images.</p>
            <div className={galleryDeleteControlsClass}>
              <a href="#!" onClick={this.onGalleryDeleteReset} className={cn({ ['gallery__delete_reset']: true, ['invisible']: galleryDeleteToggle })}>Reset</a>
              <a href="#!" onClick={this.onToggleGalleryDelete} onMouseEnter={this.toggleDeleteHelp} onMouseLeave={this.toggleDeleteHelp}>
                <i className="fa fa-trash-o gallery_delete_icon"></i>
              </a>
              <a href="#!" onClick={this.onDeleteImages} className={cn({ ['gallery_delete_confirm']: true, ['invisible']: galleryDeleteToggle })}>Delete</a>
            </div>
            <p className={galleryDeleteMsgClass}>Toggle delete mode</p>
            <p className={cn({ ['taggedForDeleteCount']: true, ['invisible']: taggedForDeleteCount < 1 })}>{this.props.galleries.taggedForDeleteCount} {`Image${char}`} selected for deletion.</p>
          </div>) : null}
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
}), Object.assign({}, authActions, adminActions, galleriesActions, lightboxActions, toastActions))(Galleries);
