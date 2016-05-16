import React from 'react';
import * as gUtils from './galleriesUtils';

export default opts => {
  return opts.gallery.map(element => {
    const cloud = gUtils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    const masonryClass = 'masonry__image__container';
    const containerClassName = element.show ? masonryClass : `${masonryClass} hide`;
    return element ? (
      <div key={element.id} id={element.id} className={containerClassName} style={{width: `${cloud.containerWidth}%` }}>
        <a href="#!" onClick={opts.scope.showLightbox}>
          <img src={cloud.src} />
        </a>
      </div>
      ) : null;
  });
};
