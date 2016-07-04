// Vendor
import React, { Component, PropTypes } from 'react';
import * as firebase from 'firebase';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import Dropzone from 'react-dropzone';
import Masonry from 'react-masonry-component';
import findKey from 'lodash.findkey';
import deepEqual from 'deep-equal';
import classNames from 'classnames';
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
    const toast = nextProps.customerGalleries.toast;
    this.path = parsePath(pathname).path;
    const validPath = findKey(this.props.customerGalleries.categories, {category: this.path });
    if (!validPath && this.props.customerGalleries.galleriesHydrated ) {
      this.context.router.replace(`/gallery`); // send to not found page
    }
    if (nextProps.auth.isApprovedCustomer) {
      const routeChange = pathname !== galleriesPathname || pathname === '/customer-galleries';
      const galleryChange = !deepEqual(nextProps.customerGalleries.images, this.props.customerGalleries.images);
      const categoriesChange = !deepEqual(nextProps.customerGalleries.categories, this.props.customerGalleries.categories);

      if (routeChange || galleryChange || categoriesChange) {
        this.galleriesPathname = pathname; // update active gallery on route/galleriessState change
        this.hydrateActiveGallery(nextProps, this);
      }
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
    if (this.props.customerGalleries.seqImagesLoadedEnabled && this.props.auth.isApprovedCustomer) { // enabled/disabled to prevent over binding
      gUtils.seqImagesLoaded(this.galleryContainer, this); // show images progressively as they load
    }
  }
  handleChange = e => {
      this.setState({...this.state, password: e.target.value});
  }
  submitPassword = e => {
    e.preventDefault();
    const password = this.state.password || '';
    const passwordError = () => {
      this.setState({ ...this.state, passwordError: true });
      setTimeout(() => { // clear errors
        this.setState({ ...this.state, passwordError: false });
      }, 7000);
    }
    // TODO: add form validation from contact
    if (password !== '') {
      this.props.submitCustomerGalleriesPassword({path:this.path, password, errorCallback: passwordError });
    }
    else {
      passwordError();
    }
  }
  render() {
    const { gallery } = this.state;
    const { customerGalleries } = this.props;
    let activeGalleryId = this.state.activeGalleryId;
    const activeCategory = customerGalleries.categories[activeGalleryId] || {};
    const zip = customerGalleries.zip[activeGalleryId];
    const hasCategories = Object.keys(customerGalleries.categories).length > 0;
    const hasImages = Object.keys(gallery).length > 0;
    const passwordClass = classNames({ ['eb__input']: true, ['eb__input_error']: this.state.passwordError });
    let customerGalleriesComponent = (
      <div>
        <h1 className="cg__title"><span className="capitalize">{this.path}</span> Gallery</h1>
        <form onSubmit={this.submitPassword} className="customer__gallery__form eb__form">
          <input data-contact-type="Password" type="password" placeholder="Enter Password" className={passwordClass} value={this.state.contactEmail} onChange={this.handleChange} ref={ref => { this.contactEmail = ref; }}/>
          <button onClick={this.submitPassword} className="eb__send_btn">Submit</button>
        </form>
      </div>);
    const isApprovedCustomer = this.props.auth.isApprovedCustomer;
    if (isApprovedCustomer) {
      customerGalleriesComponent = (
        <div className="g-row cg__container" ref={ref => { this.galleryContainer = ref; }}>
          <div className="g-col" >
            <h1 className="cg__title"><span className="capitalize">{activeCategory.category}</span> Gallery</h1>
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
    return (
      <div className="g-row cg__container" ref={ref => { this.galleryContainer = ref; }}>
        <div className="g-col" >
          {customerGalleriesComponent}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  admin: state.admin,
  customerGalleries: state.customerGalleries,
  auth: state.auth
}), Object.assign({}, authActions, adminActions, customerGalleriesActions, lightboxActions, toastActions))(CustomerGalleryViewer);
