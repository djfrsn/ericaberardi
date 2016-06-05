import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';

function getCategories(opts) {
  let categories = [];
  forIn(opts.categories, (category, key, list) => {
    const galleryLink = 'gallery__link';
    const defaultGallery = list[Object.keys(list)[0]];
    const categoryAccepted = (opts.category === '/' ? defaultGallery.category : opts.category) === category.category; // if path is root, default to first category
    const className = categoryAccepted ? `${galleryLink} active` : galleryLink;
    const protectedCategory = category.pending && !opts.scope.props.auth.authenticated;
    if (category && !protectedCategory) {
      categories.push(
        <li key={key}><Link to={`/galleries/${category.category}`} className={className}>{category.category}</Link></li>
      );
    }
  });
  return categories;
}

export default opts => {
  const categories = getCategories(opts);
  return categories;
};
