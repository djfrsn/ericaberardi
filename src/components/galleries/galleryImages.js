import React from 'react';
import cn from 'classnames';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';
import * as gUtils from './galleriesUtils';

function getImages(opts) {
  let images = [];
  let orderByOptions = [];
  const authenticated = opts.scope.props.auth.authenticated;
  forIn(opts.gallery, image => {
    orderByOptions.push(
      <option key={`orderby-${image.id}`} data-id={image.id} value={image.orderBy}>{image.orderBy}</option>
    );
  });

  let sortedOrderByOptions = []; // create new array with value as top lvl prop for easy sorting
  forEach(orderByOptions, option => {
    sortedOrderByOptions.push({...option, value: option.props.value});
  });
  // Keep option values sorted
  sortedOrderByOptions = orderBy(sortedOrderByOptions, 'value', 'asc');

  forIn(opts.gallery, image => {
    const containerWidth = gUtils.getContainerWidth({type: 'gallery-preview'}).containerWidth;
    const containerClassName = cn({ ['masonry__image__container']: true, ['hide']: !image.show });
    const imageClassName = cn({ ['gallery__image']: true, ['gallery__image_delete']: image.shouldDelete, ['pending']: image.pending });
    const starType = image.categoryPreviewImage ? 'fa-star' : 'fa-star-o';
    const imageStarClassName = cn({ ['gallery__image_star']: true, ['fa']: true, [starType]: true });
    const imageLinkClass = opts.scope.props.galleries.galleryDeleteEnabled ? 'lbx-disabled' : '';
    const protectedImage = image.pending && !authenticated;
    if (image.src && !protectedImage) {
      images.push(
        <div key={image.id} id={image.id} orderby={image.orderBy} className={containerClassName} style={{width: `${containerWidth}%` }}>
          {authenticated ? <div className="select-style"><select name="imageOrderBy" className="gallery__image_orderBy" value={image.orderBy} onChange={opts.scope.onChangeGalleryImageOrder}>
            {sortedOrderByOptions}
          </select></div> : null}
          {authenticated ? <a href="#!" onClick={opts.scope.onChangeCategoryPreviewImage} className={imageStarClassName}></a> : null}
          <a href="#!" onClick={opts.scope.onImageClick} className={imageLinkClass}>
            <img src={image.src} className={imageClassName} />
          </a>
        </div>
      );
    }
  });

  let orderedImages = [];
  forEach(images, image => {
    orderedImages.push({...image, orderBy: image.props.orderby});
  });

  return orderBy(orderedImages, 'orderBy', 'asc');
}

export default opts => {
  const galleryImages = getImages(opts);
  return galleryImages;
};
