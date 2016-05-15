import React from 'react';
import * as utils from './galleriesUtils';

export default gallery => {

  return gallery.map(element => {
    const cloud = utils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    const masonryClass = 'masonry__image__container';
    const containerClassName = element.show ? masonryClass : `${masonryClass} hide`;
    return element ? (
      <div key={element.id} id={element.id} className={containerClassName} style={{width: `${cloud.containerWidth}%` }}>
        <img src={cloud.src} />
      </div>
      ) : null;
  });
};
