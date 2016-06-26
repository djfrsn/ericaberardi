import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

function getCategories(opts) {
  const authenticated = opts.scope.props.auth.authenticated;
  let categories = [];
  const categoriesProps = opts.props.pricing.categories;
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

  forIn(categoriesProps, (category, key) => {
    const pricingLink = 'pricing__link';
    const firstCategory = category.orderBy === '1' ? category : null;
    const categoryAccepted = (opts.category === 'pricing' && firstCategory ? firstCategory.id : opts.category) === category.id; // if path is root, default to first category
    const className = categoryAccepted ? `${pricingLink} active` : pricingLink;
    if (categoryAccepted) {
      opts.scope.activeCategoryId = category.id;
    }
    if (category) {
      categories.push(
        <li key={key} id={category.id} className="pricing_link_li" orderBy={category.orderBy}>
          {authenticated ? <i onClick={opts.scope.editPricingCategory} className="fa fa-pencil-square-o pricing__categories_edit" aria-hidden="true"></i> : null}
          <Link to={`/pricing/${category.id}`} data-textedittarget className={className}>{category.pendingCategory && authenticated ? category.pendingCategory : category.category}</Link>
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

// {authenticated ? <div className="select-style"><select name="categoryOrderby" className="pricing_category_orderby" value={category.orderBy} onChange={opts.scope.onChangePricingCategoryOrder}>
//               {sortedOrderByCategories}
//           </select></div> : null}