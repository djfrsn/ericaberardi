// Vendor
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import Dropzone from 'react-dropzone';
import Masonry from 'react-masonry-component';
import deepEqual from 'deep-equal';
// App Specific
import { adminActions } from 'core/admin';
import { authActions } from 'core/auth';
import { customerGalleriesActions } from 'core/customerGalleries';
import { lightboxActions } from 'core/lightbox';
import { toastActions } from 'core/toast';
import { deleteImagesAlert, unapprovedUploadAlert } from '../galleries/galleriesAlerts';
import * as gUtils from '../galleries/galleriesUtils';
import { parsePath } from 'lava';
import galleryCategories from '../galleries/galleryCategories';
import galleryImages from '../galleries/galleryImages';
import Lightbox from '../galleries/lightbox';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export class CustomerGalleries extends Component {
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
    customerGalleries: PropTypes.object.isRequired,
    hydrateCustomerAuth: PropTypes.func.isRequired,
    hydrateCustomerGalleries: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onGalleryDeleteImages: PropTypes.func.isRequired,
    resetTaggedForGalleryDelete: PropTypes.func.isRequired,
    sendGalleriesToast: PropTypes.func.isRequired,
    showLightbox: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    tagImgForDeletion: PropTypes.func.isRequired,
    toggleGalleryDelete: PropTypes.func.isRequired,
    uploadGalleryImage: PropTypes.func.isRequired,
    uploadGalleryZipFile: PropTypes.func.isRequired
  }
  state = {
    gallery: {},
    files: [],
    showDeleteToggleMsg: false,
    loadImagesSeq: true
  }
  componentWillMount() {
    if (!this.props.auth.authenticated) {
      this.context.router.replace('/login');
    }
    this.constructorName = 'CustomerGalleries'; // uglifyjs mangles constructor names, use this one instead
    if (Object.keys(this.props.customerGalleries.categories).length > 0) {
      this.hydrateActiveGallery(this.props, this);
    } // ensure gallery is active when component mounts & componentsWillRecieveProps isn't fired
    this.unbindImagesLoaded = false;
  }
  componentDidMount() {
    window.onresize = debounce(() => {
      gUtils.resizeGallery(this); // handle responsive columns and image width/height on resizes
    }, 500);
    this.loadImagesSeq();
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const galleriesPathname = this.galleriesPathname;
    const toast = nextProps.customerGalleries.toast;
    this.path = parsePath(pathname).path;

    const routeChange = pathname !== galleriesPathname || pathname === '/customer-galleries';
    const galleryChange = !deepEqual(nextProps.customerGalleries.images, this.props.customerGalleries.images);
    const categoriesChange = !deepEqual(nextProps.customerGalleries.categories, this.props.customerGalleries.categories);
    const hasCategories = Object.keys(nextProps.customerGalleries.categories).length > 0;

    if (routeChange || galleryChange || categoriesChange && hasCategories) {
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
    this.unbindImagesLoaded = true;
    this.galleriesPathname = '';
    if (this.props.auth.authenticated) {
      this.resetTaggedForGalleryDelete();
      this.props.toggleGalleryDelete(false);
      gUtils.unbindImagesLoaded(this.galleryContainer);
    }
    window.onresize = () => {}; // remove listener
  }
  onDrop(files) {
    if (!this.state.isDragReject) {
      this.props.onDropAccept(files, this.props.className); // eslint-disable-line react/prop-types
    } // this.props here is actually equal to props for Dropzone component
  }
  onDropAccept = (files, className) => {
    if (className.indexOf('zip_file') < 0) {
      this.props.uploadGalleryImage({ files, unapprovedUploadAlert, gallery: this.state.gallery, categoryId: this.state.activeGalleryId, category: this.path });
    }
    else { // isZipFile
      this.props.uploadGalleryZipFile({ files, unapprovedUploadAlert, gallery: this.state.gallery, categoryId: this.state.activeGalleryId, category: this.path });
    }
  }
  onImageClick = e => {
    e.preventDefault();
    const lbxDisabled = Array.indexOf(e.currentTarget.classList, 'lbx-disabled') >= 0;
    if (!lbxDisabled) {
      this.props.showLightbox({e, id: e.currentTarget.parentElement.id, scope: this});
      document.querySelector('body').className = 'no-scroll';
    }
    else if (this.props.customerGalleries.galleryDeleteEnabled) { // Tag images for delection
      const imageId = e.currentTarget.parentElement.id;
      this.props.tagImgForDeletion({imageId, categoryId: this.state.activeGalleryId });
    }
  }
  hydrateActiveGallery = props => {
    if (this.props.auth.authenticated) {
      gUtils.hydrateActiveGallery(props, this); // set current gallery images src
    }
  }
  loadImagesSeq = () => {
    if (this.props.customerGalleries.seqImagesLoadedEnabled && this.props.auth.authenticated) { // enabled/disabled to prevent over binding
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  resetTaggedForGalleryDelete = () => {
    if (this.props.customerGalleries.taggedForDeleteCount > 0) {
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
    if (this.props.customerGalleries.galleryDeleteEnabled) {
      this.props.resetTaggedForGalleryDelete(); // reset taggedgalleries on toggle off
    }
  }
  onChangeGalleryCategoryOrder = e => {
    e.preventDefault();
    this.props.changeGalleryCategoryOrder({
      categoryId: e.currentTarget.parentElement.parentElement.id,
      categories: this.props.customerGalleries.categories,
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
    if (this.props.customerGalleries.taggedForDeleteCount > 0) {
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
    this.props.createCategory(this.newCategory.value, this.props);
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
    const { customerGalleries } = this.props;
    let activeGalleryId = this.state.activeGalleryId;
    const activeCategory = customerGalleries.categories[activeGalleryId] || {};
    const zip = customerGalleries.zip[activeGalleryId];
    let customerGalleriesComponent = <p style={{textAlign: 'center', marginTop: '60px'}}><Link to="/login">Login</Link> to use customer galleries.</p>;
    const authenticated = this.props.auth.authenticated;
    const hasCategories = Object.keys(customerGalleries.categories).length > 0;
    const hasImages = Object.keys(gallery).length > 0;
    const taggedForDeleteCount = customerGalleries.taggedForDeleteCount;
    const char = taggedForDeleteCount > 1 ? '\'s' : '';
    const dropZoneTitleClass = cn({ ['gallery__dropzone_title']: true, ['hidden']: !hasCategories }); // hide until a category exist
    const galleryAddCategoryClass = cn({ ['gallery__add_category_container']: true });
    const galleryDropZoneClass = cn({ ['gallery__dropzone_container']: true, ['hidden']: !hasCategories });
    const galleryDeleteControlsClass = cn({ ['gallery__delete_controls']: true, ['hidden']: !hasImages }); // hide dropzone until images loaded
    const galleryDeleteToggle = !customerGalleries.galleryDeleteEnabled;
    const galleryHelpMsgClass = cn({ ['delete__help_message']: true, ['invisible']: galleryDeleteToggle, ['hidden']: !hasImages });
    const galleryDeleteMsgClass = cn({ ['delete__toggle_message']: true, ['invisible']: !this.state.showDeleteToggleMsg });
    const addCategory = authenticated ? (<div className={galleryAddCategoryClass}>
      <form onSubmit={this.onCreateCategory}>
        <p>Create</p>
        <input type="text" placeholder="New Customer Gallery" ref={ref => this.newCategory = ref}/>
        <button type="submit" onClick={this.onCreateCategory}>Submit</button>
      </form>
    </div>) : null;
    const galleryDropZone = authenticated ? (<div className={galleryDropZoneClass}>
      <Dropzone className="gallery__dropzone" activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
    </div>) : null;
    if (authenticated) {
      customerGalleriesComponent = (
        <div className="g-row cg__container" ref={ref => { this.galleryContainer = ref; }}>
          <div className="g-col" >
            <h1 className="cg__title">Customer Galleries</h1>
            <div className="gallery__navigation">
              <ul className="galleries__links">
                {galleryCategories( { props: this.props, slug: this.path, scope: this, orderByControls: false })}
              </ul>
            </div>
            {addCategory}
            {authenticated ? (<h2 className={dropZoneTitleClass}>Upload Files</h2>) : null}
            {galleryDropZone}
            {authenticated && hasCategories ? (
              <div>
                <Dropzone className="gallery__dropzone zip_file" activeClassName="active" accept="multipart/x-zip, application/zip, application/x-compressed, application/x-zip-compressed" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
                  <div>Upload Zip File</div>
                </Dropzone>
                {zip ? (<p className="zip_file_p">Download Gallery: <a href={zip.src} target="_blank" download="true">{zip.name}</a></p>) : null}
              </div>
              ) : null}
            {authenticated && hasCategories ? (
              <div className="cg_customer__link_wrapper">
                <span className="bold">Private Link: </span><Link to={`/gallery/${activeCategory.slug}`} className="cg_customer__link">{`https://ericaberardi.com/gallery/${activeCategory.slug}`}</Link><br/><p className="cg_customer__secret"><span className="bold">Password: </span>{activeCategory.secretId}</p>
              </div>
              ) : null}
            <div className="gallery">
              <Masonry
                ref={ref => { this.masonry = ref; }}
                className={'gallery__masonry'} // default ''
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                >
                  {galleryImages({gallery, scope: this, favPreviewImg: false})}
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
              <p className={cn({ ['taggedForDeleteCount']: true, ['invisible']: taggedForDeleteCount < 1 })}>{customerGalleries.taggedForDeleteCount} {`Image${char}`} selected for deletion.</p>
            </div>) : null}
            <Lightbox/>
          </div>
        </div>
      );
    }
    return customerGalleriesComponent;
  }
}

export default connect(state => ({
  admin: state.admin,
  customerGalleries: state.customerGalleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, customerGalleriesActions, lightboxActions, toastActions))(CustomerGalleries);
