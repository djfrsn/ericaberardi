// Vendor
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import Dropzone from 'react-dropzone';
import Masonry from 'react-masonry-component';
import deepEqual from 'deep-equal';
// App Specific
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { galleriesActions } from 'core/galleries';
import { lightboxActions } from 'core/lightbox';
import { toastActions } from 'core/toast';
import { deleteImagesAlert, unapprovedUploadAlert } from './galleriesAlerts';
import * as gUtils from './galleriesUtils';
import { parsePath } from 'lava';
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
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    changeCategoryPreviewImage: PropTypes.func.isRequired,
    changeGalleryCategoryOrder: PropTypes.func.isRequired,
    changeGalleryImageOrder: PropTypes.func.isRequired,
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
    files: [],
    showDeleteToggleMsg: false,
    loadImagesSeq: true
  }
  componentWillMount() {
    this.constructorName = 'Galleries'; // uglifyjs mangles constructor names, use this one instead
    this.unbindImagesLoaded = false;
    this.props.highlightGalleriesLink(true);
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
  }
  componentDidMount() {
    window.onresize = debounce(() => {
      gUtils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    }, 500);
    this.loadImagesSeq();
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const galleriesPathname = this.galleriesPathname;
    const toast = nextProps.galleries.toast;
    this.path = parsePath(pathname).path;

    const routeChange = pathname !== galleriesPathname || pathname === '/galleries';
    const galleryChange = !deepEqual(nextProps.galleries.images, this.props.galleries.images);
    const categoriesChange = !deepEqual(nextProps.galleries.categories, this.props.galleries.categories);

    if (routeChange || galleryChange || categoriesChange) {
      this.galleriesPathname = pathname; // update active gallery on route/galleriessState change
      this.hydrateActiveGallery(nextProps, this);
    }
    if (toast.type) {
      this.props.clearGalleriesToast();
      this.props.showToast(toast);
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
    this.resetTaggedForGalleryDelete();
    this.props.toggleGalleryDelete(false);
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
    this.props.uploadGalleryImage({ files, unapprovedUploadAlert, gallery: this.state.gallery, categoryId: this.state.activeGalleryId, category: this.path });
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
      this.props.tagImgForDeletion({imageId, categoryId: this.state.activeGalleryId });
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
  resetTaggedForGalleryDelete = () => {
    if (this.props.galleries.taggedForDeleteCount > 0) {
      this.props.resetTaggedForGalleryDelete();
    }
  }
  onGalleryDeleteReset = e => {
    e.preventDefault();
    this.resetTaggedForGalleryDelete();
  }
  onToggleGalleryDelete = e => {
    e.preventDefault();
    this.props.toggleGalleryDelete();
    if (this.props.galleries.galleryDeleteEnabled) {
      this.props.resetTaggedForGalleryDelete(); // reset taggedgalleries on toggle off
    }
  }
  onChangeGalleryCategoryOrder = e => {
    e.preventDefault();
    this.props.changeGalleryCategoryOrder({
      categoryId: e.currentTarget.parentElement.parentElement.id,
      categories: this.props.galleries.categories,
      desiredOrderBy: e.currentTarget.selectedOptions[0].value
    });
  }
  onChangeGalleryImageOrder = e => {
    e.preventDefault();
    this.props.changeGalleryImageOrder({
      imageId: e.currentTarget.parentElement.parentElement.id,
      gallery: this.state.gallery,
      desiredOrderBy: e.currentTarget.selectedOptions[0].value
    });
  }
  onChangeCategoryPreviewImage = e => {
    e.preventDefault();
    this.props.changeCategoryPreviewImage({
      imageId: e.currentTarget.parentElement.id,
      gallery: this.state.gallery
    });
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
    const { gallery } = this.state;
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
      <p className="gallery__dropzone_help">*Pending images have a yellow border.</p>
    </div>) : null;
    return (
      <div className="g-row gallery__container" ref={ref => { this.galleryContainer = ref; }}>
        <div className="g-col" >
          <div className="gallery__navigation">
            <ul className="galleries__links">
              {galleryCategories( { props: this.props, slug: this.path, scope: this })}
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
