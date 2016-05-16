import React from 'react';
import { Link } from 'react-router';
import utils from 'utils';

export default opts => {
  const galleries = opts.galleries;
  const categories = Object.keys(galleries);

  let columns = null;
  // columns are list of images
  if (categories.length > 0) {
    let columnsMeta = { '0': [], '1': [] };
    // push every other category into each column
    categories.forEach((category, key) => {
      if (key % 2 === 0) {
        columnsMeta['0'].push(category)
      }
      else {
        columnsMeta['1'].push(category);
      }
    });
    // for each column return gallery-col
    columns = (Object.keys(columnsMeta).map((column, key) => {
      return (
        <div key={key} className={`gallery-col-${key}`}>
        {
          columnsMeta[column].map(category => {
          // return random img for each category
          const elements = galleries[category] || [];
          const ri = utils.randomInt(0, elements.length);
          const element = elements[ri];
          console.log(element, opts);
            return element ? (
              <div key={element.id} id={element.id} className="image__container">
                <img src={element.src} />
                <Link to={`galleries/${category.toLowerCase()}`} className="gallery__link" >
                  <div className="overlay">
                    <div className="overlay__content">
                      <div><p className="gallery-image-text">{category}</p></div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : null;
          })
        }
        </div>
      );
    }));
  }

  return columns;
};
