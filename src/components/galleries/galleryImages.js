import React from 'react';
import cn from 'classnames';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';
import * as gUtils from './galleriesUtils';

function getImages(opts) {
  let images = [];
  let imageIndexOptions = [];

  forIn(opts.gallery, image => {
    imageIndexOptions.push(
      <option key={`orderby-${image.id}`} data-id={image.id} value={image.orderBy}>{image.orderBy}</option>
    );
  });
  // TODO: try sorting the values here
  forIn(opts.gallery, image => {
    const containerWidth = gUtils.getContainerWidth({type: 'gallery-preview'});
    const containerClassName = cn({ ['masonry__image__container']: true, ['hide']: !image.show });
    const imageClassName = cn({ ['gallery__image']: true, ['gallery__image_delete']: image.shouldDelete, ['pending']: image.pending });
    const imageLinkClass = opts.scope.props.galleries.galleryDeleteEnabled ? 'lbx-disabled' : '';
    const protectedImage = image.pending && !opts.scope.props.auth.authenticated;
    if (image.src && !protectedImage) {
      images.push(
        <div key={image.id} id={image.id} orderby={image.orderBy} className={containerClassName} style={{width: `${containerWidth}%` }}>
          {opts.scope.props.auth.authenticated ? <select name="imageOrderBy" value={image.orderBy} onChange={opts.scope.onChangeGalleryImageOrder}>
            {imageIndexOptions}
          </select> : null}
          <a href="#!" onClick={opts.scope.onChangeCategoryMainImage} className="gallery__image_star"></a>
          <a href="#!" onClick={opts.scope.onImageClick} className={imageLinkClass}>
            <img src={image.src} className={imageClassName} />
          </a>
        </div>
      );
    }
  });

  let orderedImages = [];
  forEach(images, image => {
    orderedImages.push({...image, orderby: image.props.orderby});
  });

  return orderBy(orderedImages, 'orderby', 'asc');
}

export default opts => {
  const galleryImages = getImages(opts);
  return galleryImages;
};
