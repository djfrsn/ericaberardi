import imagesLoaded from 'imagesloaded';


export function parsePath(val) {
  let path = '/';
  const pathSplit = val.split('/');
  if (pathSplit.length === 3) {
    path = pathSplit[2];
  }

  return {
    path
  };
}

export function setGallery(props, scope) {
  const { pathname } = props.location;
  const path = parsePath(pathname).path;
  const defaultGallery = 'commercial';
  const galleryPath = path === '/' ? defaultGallery : path;
  const galleries = props.galleries.galleries;
  const gallery = props.galleries.galleries[galleryPath] || {};
  const categories = Object.keys(galleries);

  if (categories.length > 0) {
    scope.setState({ categories, gallery });
  }
}

// TODO: sequential loading
// http://masonry.desandro.com/extras.html
// https://github.com/desandro/imagesloaded
export function seqImagesLoaded(element) {
  // debugger
  // images are hidden by default
  // a dispatch is used to iteratively remove the hidden class from each element
  // as its triggered by the imagesLoaded.progress event
}


// return type for media queries
export function mq() {
  let mqt = 'mobile'; // default media query type
  const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  if (width > 480 && width < 960) {
    mqt = 'tablet';
  }
  if (width > 960) {
    mqt = 'desktop';
  }
  return mqt;
}

export function resizeGallery(scope) {
  switch (mq()) {
    case 'desktop':
      break;
    case 'tablet':
      break;
    default:
  }
  // change image column count by updating image width, height
  // check the window size and define rules for column count @ window.width
}

function randomInt( min, max ) {
  return Math.floor( Math.random() * max + min );
}

export function cloudinaryTransform( opts ) {
  let width = '';
  let height = '';
  let src = opts.src;
  const mqt = mq();
  switch (opts.type) {
    case 'gallery-preview':
      if (mqt === 'mobile') {
        width = randomInt( 150, 400 );
        height = randomInt( 150, 250 );
      }
      else if (mqt === 'tablet') {
        width = randomInt( 150, 400 );
        height = randomInt( 150, 250 );
      }
      else if (mqt === 'desktop') {
        width = randomInt( 150, 400 );
        height = randomInt( 150, 250 );
        debugger
      }
      break;
    case 'gallery-expanded':
      break;
    default:
  }
  // return imageMeta height & width to vary img sizing in grid
  // transform a given src to cloudinary format based on the window.width
  return {
    height: height,
    width: width,
    src
  };
}
// TODO: set random height widths for images

var width = randomInt( 150, 400 );
var height = randomInt( 150, 250 );
