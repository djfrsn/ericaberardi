import React from 'react';
import * as utils from './galleriesUtils';

export default gallery => {

  return gallery.map((element, key) => {
    const cloud = utils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    return element ? (
      <div key={key} className="masonry__image__container" style={{width: `${cloud.containerWidth}%` }}>
        <img src={cloud.src} />
      </div>
      ) : null;
  });
};
