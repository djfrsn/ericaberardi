import React from 'react';
import * as gUtils from './galleriesUtils';

export default opts => {
  return opts.gallery.map(element => {
    let cloud;
    if (element.src.includes('cloudinary')) {
      cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    }
    const src = cloud ? cloud.src : element.src;
    const containerWidth = cloud ? cloud.containerWidth : gUtils.getContainerWidth({type: 'gallery-preview'});
    const masonryClass = 'masonry__image__container';
    const containerClassName = element.show ? masonryClass : `${masonryClass} hide`;
    return element ? (
      <div key={element.id} id={element.id} className={containerClassName} style={{width: `${containerWidth}%` }}>
        <a href="#!" onClick={opts.scope.showLightbox}>
          <img src={src} />
        </a>
      </div>
      ) : null;
  });
};
