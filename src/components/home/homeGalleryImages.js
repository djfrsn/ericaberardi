import React from 'react';
import { Link } from 'react-router';

export default opts => {
  return opts.gallery.map((element, index) => {
    return element ? (
      <div key={index} id={element.id} className="image__container" ref={ref => { opts.scope[`gallery-${opts.direction}-${index}`] = ref; }} >
        <img src={element.src} />
        <Link to={`galleries/${element.category.toLowerCase()}`} className="gallery__link" >
          <div className="overlay">
            <div className="overlay__content" id={element.id} data-gallery={opts.galleryName}>
              <div><p className="gallery-image-text">{element.category}</p></div>
            </div>
          </div>
        </Link>
      </div>
    ) : null;
  });
};
