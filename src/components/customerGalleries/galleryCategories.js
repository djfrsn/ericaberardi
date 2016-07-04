import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

function getCategories(opts) {
  const authenticated = opts.scope.props.auth.authenticated;
  let categories = [];
  const categoriesProps = opts.props.customerGalleries.categories;
  let categoryOptions = [];

  forIn(categoriesProps, category => {
    categoryOptions.push(
      <option key={`orderby-${category.id}`} data-id={category.id} value={category.orderBy}>{category.orderBy}</option>
    );
  });

  let sortedOrderByCategories = []; // create new array with value as top lvl prop for easy sorting
  forEach(categoryOptions, option => {
    sortedOrderByCategories.push({...option, value: option.props.value});
  });
  // Keep option values sorted
  sortedOrderByCategories = orderBy(sortedOrderByCategories, 'value', 'asc');

  forIn(categoriesProps, (category, key, list) => {
    const galleryLink = 'gallery__link';
    const defaultGallery = list[Object.keys(list)[0]];
    const categoryAccepted = (opts.category === '/' ? defaultGallery.category : opts.category) === category.category; // if path is root, default to first category
    const className = categoryAccepted ? `${galleryLink} active` : galleryLink;
    const protectedCategory = category.pending && !authenticated;
    if (category && !protectedCategory) {
      categories.push(
        <li key={key} id={category.id} orderBy={category.orderBy}>
          <Link to={`/customer-galleries/${category.category}`} className={className}>{category.category}</Link>
        </li>
      );
    }
  });

  let orderedCategories = [];
  forEach(categories, category => {
    orderedCategories.push({...category, orderBy: category.props.orderBy});
  });

  return orderBy(orderedCategories, 'orderBy', 'asc');
}

export default opts => {
  const categories = getCategories(opts);
  return categories;
};

// {authenticated ? <div className="select-style"><select name="categoryOrderby" className="gallery_category_orderby" value={category.orderBy} onChange={opts.scope.onChangeGalleryCategoryOrder}>
//   {sortedOrderByCategories}
// </select></div> : null}
