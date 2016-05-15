import React from 'react';
import * as utils from './galleriesUtils';

export default gallery => {

  return gallery.map((element, key) => {
    const cloudinary = utils.cloudinaryTransform({ type: 'gallery-preview', src: element.src });
    return element ? (
      <div key={key} className="masonry__image__container">
        <img src={cloudinary.src} />
      </div>
      ) : null;
  });
};
