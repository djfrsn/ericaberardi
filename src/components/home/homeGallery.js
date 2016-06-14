import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';

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
            const images = galleries[category.id] || {};
            let previewImage;
            forIn(images, image => {
              if (image.categoryPreviewImage) {
                previewImage = image;
              }
            });
            // return random img for each category
            // const previewImageKeys = Object.keys(images);
            // const ri = utils.randomInt(0, previewImageKeys.length);
            // const previewImage = images[previewImageKeys[ri]];

            return previewImage ? (
              <div key={previewImage.id} id={previewImage.id} className="image__container">
                <Link to={`galleries/${previewImage.category.toLowerCase()}`} className="gallery__link" >
                  <h2 className="home__gallery_title">{previewImage.category}</h2>
                  <img src={previewImage.src} />
                  <div className="overlay">
                    <div className="overlay__content">
                      <div className="gallery-image-text">{previewImage.category}</div>
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
