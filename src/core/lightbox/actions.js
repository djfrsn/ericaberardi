import {
  INIT_LIGHTBOX,
} from './action-types';
import PhotoSwipe from 'photoswipe';
// photoswipe strategy
// on link click dispatch id to initPhotoswipe
// get src & use utils.cloudinary to transform into gallery-lightbox url depending on size
// iniy photoswipe w/ array of current gallery & index of given img/id

export function showLightbox(opts) {
  // const photoswipe = new Photoswipe();
  const pswpElement = document.querySelectorAll('.pswp')[0];
  const id = opts.e.currentTarget.parentElement.id;
  const imgs = opts.scope.galleryContainer.querySelectorAll('img');
  let index = 0;
  // imgs.every((img, key) => {
  //   const imgId = img.parentElement.parentElement.id;
  //   if (id === imgId) {
  //     console.log(opts);
  //     index = key;
  //     return true;
  //   }
  //   console.log('running');
  // });
  const gallery = opts.scope.state.gallery.map((img, key) => {
    return {
      ...img,
      w: imgs[key].width,
      h: imgs[key].height
    };
  });
  const lightbox = new PhotoSwipe( pswpElement, false, gallery, {index});
  lightbox.init();
  return dispatch => {
    dispatch({
      type: INIT_LIGHTBOX,
      payload: ''
    });
  };
}
