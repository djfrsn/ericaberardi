import React from 'react';
import cn from 'classnames';
import * as gUtils from './galleriesUtils';

export default opts => {
  return opts.gallery.map(element => {
    let cloud;
    if (element.src.includes('cloudinary')) {
      cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    }
    console.log(element.shouldDelete);
    const src = cloud ? cloud.src : element.src;
    const containerWidth = cloud ? cloud.containerWidth : gUtils.getContainerWidth({type: 'gallery-preview'});
    const containerClassName = cn({ ['masonry__image__container']: true, ['hide']: !element.show, ['gallery__image_delete']: element.shouldDelete });
    const imageLinkClass = opts.scope.props.galleries.galleryDeleteEnabled ? 'lbx-disabled' : '';
    return element ? (
      <div key={element.id} id={element.id} className={containerClassName} style={{width: `${containerWidth}%` }}>
        <a href="#!" onClick={opts.scope.onImageClick} className={imageLinkClass}>
          <img src={src} />
        </a>
      </div>
      ) : null;
  });
};
