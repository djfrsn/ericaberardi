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

export function seqImagesLoaded(element) {
  // debugger
  // images are hidden by default
  // a dispatch is used to iteratively remove the hidden class from each element
  // as its triggered by the imagesLoaded.progress event
}

export function mq() {
  debugger
  // return type for media queries
}

export function resizeGallery(scope) {
  debugger
  switch(mq()) {
    case 'desktop':
      break;
    case 'tablet':
      break;
    default:
  }
  // change image column count by updating image width, height
  // check the window size and define rules for column count @ window.width
}

export function cloudinaryTransform( opts ) {
  // debugger
  // return imageMeta height & width to vary img sizing in grid
  // transform a given src to cloudinary format based on the window.width
  return {
    src: opts.src
  };
}

// TODO: sequential loading
// http://codepen.io/desandro/pen/kwsJb

// TODO: set random height widths for images
// function randomInt( min, max ) {
//   return Math.floor( Math.random() * max + min );
// }
// var width = randomInt( 150, 400 );
// var height = randomInt( 150, 250 );
