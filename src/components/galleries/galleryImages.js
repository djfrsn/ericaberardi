import React from 'react';
import cn from 'classnames';
import forIn from 'lodash.forin';
import * as gUtils from './galleriesUtils';

function getImages(opts) {
  let images = [];

  forIn(opts.gallery, image => {
    const containerWidth = gUtils.getContainerWidth({type: 'gallery-preview'});
    const containerClassName = cn({ ['masonry__image__container']: true, ['hide']: !image.show });
    const imageClassName = cn({ ['gallery__image']: true, ['gallery__image_delete']: image.shouldDelete, ['pending']: image.pending });
    const imageLinkClass = opts.scope.props.galleries.galleryDeleteEnabled ? 'lbx-disabled' : '';
    const protectedImage = image.pending && !opts.scope.props.auth.authenticated;
    if (image.src && !protectedImage) {
      images.push(
        <div key={image.id} id={image.id} className={containerClassName} style={{width: `${containerWidth}%` }}>
          <a href="#!" onClick={opts.scope.onChangeCategoryMainImage} className="gallery__image_star"></a>
          <a href="#!" onClick={opts.scope.onImageClick} className={imageLinkClass}>
            <img src={image.src} className={imageClassName} />
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
