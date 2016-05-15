import React from 'react';

export default gallery => {

  return gallery.map((element, key) => {
    return element ? (
      <div key={key} className="masonry__image__container">
        <img src={element.src} />
      </div>
      ) : null;
  });
};
