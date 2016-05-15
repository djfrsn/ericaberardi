import imagesLoaded from 'imagesloaded';

export function parsePath(val) { // takes paths like galleries/sports and returns sports
  let path = '/';
  const pathSplit = val.split('s/');
  const length = pathSplit.length;

  if (length === 2 || length === 3) {
    path = pathSplit[length - 1];
  }

  return {
    path
  };
}

export function setGallery(props, scope) {
  const { pathname } = props.location;
  const path = parsePath(pathname).path;
  const defaultGallery = 'commercial';
  const galleries = props.galleries.galleries;
  const categories = Object.keys(galleries);
  const galleryPath = categories.includes(path) ? path : defaultGallery;
  let galleryProp = props.galleries.galleries[galleryPath];

  if (path !== galleryPath) { // if needed correct browser url to show current category
    scope.context.router.replace(`/galleries/${galleryPath}`);
  }

  if (categories.length > 0) {
    const gallery = galleryProp.map(image => {
      return {
        ...image,
        show: false // add view only attributes
      };
    });
    scope.setState({ ...scope.state, categories, gallery, loadImagesSeq: true });
  }
}

// TODO: sequential loading
// http://masonry.desandro.com/extras.html
// https://github.com/desandro/imagesloaded
export function seqImagesLoaded(element, scope) {
  const imgLoad = imagesLoaded(element);

  // a dispatch is used to iteratively remove the hidden class from each element
  imgLoad.on( 'progress', ( instance, image ) => {
    const loaded = image.isLoaded;
    if (scope.state.loadImagesSeq) {
      scope.setState({...scope.state, loadImagesSeq: false });
    }
    if (loaded) {
      const img = image.img;
      const id = img.parentElement.id;

      // reveal image
      const gallery = scope.state.gallery.map(image => {
        return {
          ...image, // update state to reveal each image
          show: image.id === id ? true : image.show
        };
      });
      scope.setState({...scope.state, gallery});
    }
  });
  // images are hidden by default
  // as its triggered by the imagesLoaded.progress event
}


// return type for media queries
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
    this.setGallery(scope.props, scope);
  }
}

// function randomInt( min, max ) {
//   return Math.floor( Math.random() * max + min );
// }
// http://cloudinary.com/documentation/image_transformations#image_optimization
export function cloudinaryTransform( opts ) {
  let containerWidth = 100; // mobile defaults
  let srcWidth = 275;
  const mqt = mq();
  const url = opts.src.split('d/v');
  const defaults = 'f_auto,c_scale';
  const getUrl = w => {
    return `${url[0]}d/${defaults},w_${w}/v${url[1]}`;
  };
  // ar_4:3 http://cloudinary.com/documentation/image_transformations#aspect_ratio_based_cropping
  // f_auto auto deliver best file format
  // q_70 quality
  switch (opts.type) {
    case 'gallery-preview':
      if (mqt === 'mobile') {
        containerWidth = 100;
        srcWidth = 275;
      }
      else if (mqt === 'tablet') {
        containerWidth = 50;
        srcWidth = 300;
      }
      else if (mqt === 'laptop') {
        containerWidth = 33.33333333;
        srcWidth = 300;
      }
      else if (mqt === 'desktop') {
        containerWidth = 25;
        srcWidth = 350;
      }
      break;
    case 'gallery-expanded':
      break;
    default:
  }
  // return containerWidth as a percentage to control column count
  // transform a given src to cloudinary format based on the window.width
  return {
    containerWidth: containerWidth,
    src: opts.src.includes('lorempixel') ? opts.src : getUrl(srcWidth)
  };
}
// TODO: set random height widths for images

// var width = randomInt( 150, 400 );
// var height = randomInt( 150, 250 );
