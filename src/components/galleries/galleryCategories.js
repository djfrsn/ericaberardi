import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';

function getCategories(opts) {
  const authenticated = opts.scope.props.auth.authenticated;
  let categories = [];
  const categoriesProps = opts.props.galleries.categories;
  let categoryOptions = [];

  forIn(categoriesProps, category => {
    categoryOptions.push(
      <option key={`orderby-${category.id}`} data-id={category.id} value={category.orderby}>{category.orderby}</option>
    );
  });

  forIn(categoriesProps, (category, key, list) => {
    const galleryLink = 'gallery__link';
    const defaultGallery = list[Object.keys(list)[0]];
    const categoryAccepted = (opts.category === '/' ? defaultGallery.category : opts.category) === category.category; // if path is root, default to first category
    const className = categoryAccepted ? `${galleryLink} active` : galleryLink;
    const protectedCategory = category.pending && !authenticated;
    if (category && !protectedCategory) {
      categories.push(
        <li key={key}>
          {authenticated ? <div className="select-style"><select name="categoryOrderby" className="gallery_category_orderby" value={category.orderby} onChange={opts.scope.onChangeGalleryCategoryOrder}>
            {categoryOptions}
          </select></div> : null}
          <Link to={`/galleries/${category.category}`} className={className}>{category.category}</Link>
        </li>
      );
    }
  });
  return categories;
}

export default opts => {
  const categories = getCategories(opts);
  return categories;
};
