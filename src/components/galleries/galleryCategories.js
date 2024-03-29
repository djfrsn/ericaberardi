import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

function getCategories(opts) {
  const authenticated = opts.scope.props.auth.authenticated;
  const orderByControls = typeof opts.orderByControls === 'boolean' ? opts.orderByControls : true;
  const isCustomerGalleries = opts.scope.constructorName === 'CustomerGalleries';
  const galleriesPropName = isCustomerGalleries ? 'customerGalleries' : 'galleries';
  const galleriesRoute = isCustomerGalleries ? 'customer-galleries' : 'galleries';
  let categories = [];
  const categoriesProps = opts.props[galleriesPropName].categories;
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
    const categoryAccepted = (opts.slug === '/' ? defaultGallery.slug : opts.slug) === category.slug; // if path is root, default to first category
    const className = categoryAccepted ? `${galleryLink} active` : galleryLink;
    const protectedCategory = category.pending && !authenticated;
    if (category && !protectedCategory) {
      categories.push(
        <li key={key} id={category.id} orderBy={category.orderBy}>
          {authenticated && orderByControls ? <div className="select-style"><select name="categoryOrderby" className="gallery_category_orderby" value={category.orderBy} onChange={opts.scope.onChangeGalleryCategoryOrder}>
            {sortedOrderByCategories}
          </select></div> : null}
          <Link to={`/${galleriesRoute}/${category.slug}`} className={className}>{category.category}</Link>
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
