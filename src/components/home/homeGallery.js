import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';
import utils from 'utils';

export default opts => {
  const galleries = opts.images;
  const categories = opts.categories;
  const categoriesLength = Object.keys(opts.categories).length;
  let columns = null;
  // columns are list of images
  if (categoriesLength > 0) {
    let columnsMeta = { '0': [], '1': [] };
    // push every other category into each column
    let key = 0;
    forIn(categories, category => {
      const protectedCategory = category.pending && !opts.scope.props.auth.authenticated;
      if (key % 2 === 0) {
        if (!protectedCategory) {
          columnsMeta['0'].push(category);
        }
      }
      else {
        if (!protectedCategory) {
          columnsMeta['1'].push(category);
        }
      }
      key++;
    });
    // for each column return gallery-col
    columns = (Object.keys(columnsMeta).map((column, key) => {
      return (
        <div key={key} className={`gallery-col-${key}`}>
        {
          columnsMeta[column].map(category => {
            // return random img for each category
            const elements = galleries[category.id] || {};
            const elementKeys = Object.keys(elements);
            const ri = utils.randomInt(0, elementKeys.length);
            const element = elements[elementKeys[ri]];

            return element ? (
              <div key={element.id} id={element.id} className="image__container">
                <img src={element.src} />
                <Link to={`galleries/${element.category.toLowerCase()}`} className="gallery__link" >
                  <div className="overlay">
                    <div className="overlay__content">
                      <div className="gallery-image-text">{element.category}</div>
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
