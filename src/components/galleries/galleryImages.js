import React from 'react';
import cn from 'classnames';
import forIn from 'lodash.forin';
import * as gUtils from './galleriesUtils';

function getImages(opts) {
  let images = [];
  forIn(opts.gallery, element => {
    const containerWidth = gUtils.getContainerWidth({type: 'gallery-preview'});
    const containerClassName = cn({ ['masonry__image__container']: true, ['hide']: !element.show });
    const imageClassName = cn({ ['gallery__image']: true, ['gallery__image_delete']: element.shouldDelete });
    const imageLinkClass = opts.scope.props.galleries.galleryDeleteEnabled ? 'lbx-disabled' : '';
    const protectedImage = element.pending && !opts.scope.props.auth.authenticated;
    if (element.src && !protectedImage) {
      images.push(
        <div key={element.id} id={element.id} className={containerClassName} style={{width: `${containerWidth}%` }}>
          <a href="#!" onClick={opts.scope.onImageClick} className={imageLinkClass}>
            <img src={element.src} className={imageClassName} />
          </a>
        </div>
      );
    }
  });

  return images;
}

export default opts => {
  const galleryImages = getImages(opts);
  return galleryImages;
};
