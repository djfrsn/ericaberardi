// Vendor
import React, { Component, PropTypes } from 'react';
import * as firebase from 'firebase';
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
import * as gUtils from '../galleries/galleriesUtils';
import { parsePath } from 'lava';
import galleryImages from '../galleries/galleryImages';
import Lightbox from '../galleries/lightbox';

const masonryOptions = {
  transitionDuration: 500,
  percentPosition: true
};

export class CustomerGalleryViewer extends Component {
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
  constructor(props) {
    super(props); // fetch data for logged out/anon users coming directly to customer galleries
    if (Object.keys(props.customerGalleries.categories).length < 1) {
      let customerGalleries = firebase.database().ref('customerGalleries');

      customerGalleries.on('value', snapshot => {
        this.props.hydrateCustomerGalleries(snapshot.val());
      });
    }
  }
  state = {
    gallery: {},
    files: [],
    loadImagesSeq: true
  }
  componentWillMount() {
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
    this.unbindImagesLoaded = true;
    this.galleriesPathname = '';
    gUtils.unbindImagesLoaded(this.galleryContainer);
    window.onresize = () => {}; // remove listener
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
    gUtils.hydrateActiveGallery(props, this); // set current gallery images src
  }
  loadImagesSeq = () => {
    if (this.props.customerGalleries.seqImagesLoadedEnabled) { // enabled/disabled to prevent over binding
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
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
    if (authenticated) {
      customerGalleriesComponent = (
        <div className="g-row cg__container" ref={ref => { this.galleryContainer = ref; }}>
          <div className="g-col" >
            <h1 className="cg__title"><span style={{textTransform: 'capitalize'}}>{activeCategory.category}</span> Gallery</h1>
            {zip ? (<p className="zip_file_p">Download Gallery: <a href={zip.src} target="_blank" download="true">{zip.name}</a></p>) : null}
            <div className="gallery">
              <Masonry
                ref={ref => { this.masonry = ref; }}
                className={'gallery__masonry'} // default ''
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                >
                  {galleryImages({gallery, scope: this, favPreviewImg: false, orderByControls: false })}
              </Masonry>
            </div>
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
}), Object.assign({}, authActions, adminActions, customerGalleriesActions, lightboxActions, toastActions))(CustomerGalleryViewer);
