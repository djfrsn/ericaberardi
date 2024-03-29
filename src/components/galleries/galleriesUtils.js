import imagesLoaded from 'imagesloaded';
import filter from 'lodash.filter';
import forIn from 'lodash.forin';
import mapValues from 'lodash.mapvalues';
import { parsePath } from 'lava';

export function hydrateActiveGallery(props, scope) {
  const { pathname } = props.location;
  const path = parsePath(pathname).path;
  const isCustomerGalleries = scope.constructorName === 'CustomerGalleries';
  const isCustomerGalleryViewer = scope.constructorName === 'CustomerGalleryViewer';
  const galleriesPropName = isCustomerGalleries || isCustomerGalleryViewer ? 'customerGalleries' : 'galleries';
  const baseRoute = scope.constructorName === 'CustomerGalleryViewer' ? 'gallery' : 'galleries';
  const galleriesRoute = isCustomerGalleries ? 'customer-galleries' : baseRoute;
  const galleries = props[galleriesPropName].images;
  const categories = props[galleriesPropName].categories;

  if (Object.keys(categories).length > 0) {

    const defaultGallery = categories[Object.keys(categories)[0]];
    const galleryMatch = filter(categories, { slug: path })[0];

    const galleryPath = galleryMatch ? galleryMatch.slug : defaultGallery.slug;

    const category = () => {
      return categories[filter(categories, { slug: galleryPath })[0].id || defaultGallery.id];
    };
    let activeGalleryId = category().id;
    let activeGallery = galleries[activeGalleryId];

    if (path !== galleryPath) { // if needed correct browser url to show current category
      scope.context.router.replace(`/${galleriesRoute}/${galleryPath}`);
    }

    const gallery = {};

    forIn(activeGallery, (image, id) => {
      gallery[id] = {
        ...image, // force show when seqImagesLoaded is disabled...
        show: !scope.props[galleriesPropName].seqImagesLoadedEnabled ? true : false // since that function would otherwise reveals images
      };
    });

    scope.setState({ ...scope.state, gallery, activeGalleryId });
    if (!scope.props[galleriesPropName].forceImagesLoadedOff) {
      scope.props.seqImagesLoadedEnabled(true); // enable to allow imgLoad.progress event to rebind handler after additional images have been added
    }
  }
}

export function unbindImagesLoaded(element) {
  const imgLoad = imagesLoaded(element);

  imgLoad.off( 'progress' );
}

// http://masonry.desandro.com/extras.html
// https://github.com/desandro/imagesloaded
export function seqImagesLoaded(element, scope) {
  const galleriesPropName = scope.constructorName === 'CustomerGalleries' || scope.constructorName === 'CustomerGalleryViewer' ? 'customerGalleries' : 'galleries';
  const imgLoad = imagesLoaded(element);
  if (scope.props[galleriesPropName].seqImagesLoadedEnabled) {
    scope.props.seqImagesLoadedEnabled(false); // set false to signify imgLoad.progress event handler has been set
  }

  // NOTE: this is a perf hog and should only run when images are in the galleryContainer or when more images are added
  imgLoad.on( 'progress', ( instance, image ) => {
    const loaded = image.isLoaded;
    if (loaded && !scope.unbindImagesLoaded) {
      const img = image.img;
      const id = img.parentElement.parentElement.id;

      const gallery = mapValues(scope.state.gallery, image => {
        return { // images are hidden by default
          ...image, // update state to reveal each image
          show: image.id === id ? true : (image.show || false)
        };
      });

      scope.setState({...scope.state, gallery});
    }
  });
}

// media queries
export function mq() {
  let mqt = 'mobile'; // default media query type
  const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  if (width > 480 && width < 992) {
    mqt = 'tablet';
  }
  if (width > 960 && width < 1200) {
    mqt = 'laptop';
  }
  if (width >= 1200) {
    mqt = 'desktop';
  }
  return mqt;
}

// change image column count by updating image width, height
// check the window size and define rules for column count @ window.width
export function resizeGallery(scope) {
  const needResizeLayout = scope.masonry.masonry.needsResizeLayout();
  if (needResizeLayout) {
    this.hydrateActiveGallery(scope.props, scope); // runs getContainerWidth to set img width based on screen size
  }
}
export function getContainerWidth( opts ) {
  let containerWidth = 100; // mobile defaults
  const mqt = mq();

  switch (opts.type) {
    case 'gallery-preview':
      if (mqt === 'mobile') {
        containerWidth = 100;
      }
      else if (mqt === 'tablet') {
        containerWidth = 50;
      }
      else if (mqt === 'laptop') {
        containerWidth = 33.33333333;
      }
      else if (mqt === 'desktop') {
        containerWidth = 25;
      }
      break;
    default:
  }
  // return containerWidth as a percentage to control column count
  return {
    containerWidth: containerWidth
  };
}

export function imageTransform( opts ) {
  let containerWidth = 100; // mobile defaults
  let srcWidth = 275;
  let srcHeight;
  const windowHeight = window.innerHeight;
  const mqt = mq();

  switch (opts.type) {
    case 'gallery-preview':
      if (mqt === 'mobile') {
        containerWidth = 100;
        srcWidth = opts.hq ? 480 : 275;
      }
      else if (mqt === 'tablet') {
        containerWidth = 50;
        srcWidth = opts.hq ? 582 : 360;
      }
      else if (mqt === 'laptop') {
        containerWidth = 33.33333333;
        srcWidth = opts.hq ? 812 : 480;
      }
      else if (mqt === 'desktop') {
        containerWidth = 25;
        srcWidth = opts.hq ? 1080 : 640;
      }
      break;
    case 'gallery-expanded':
      srcHeight = windowHeight - Math.round(10 / 100 * windowHeight);
      break;
    default:
  }
  // return containerWidth as a percentage to control column count
  return {
    containerWidth: containerWidth,
    src: opts.src.includes('lorempixel') ? opts.src : {srcWidth, srcHeight}
  };
}
