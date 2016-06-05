import React from 'react';
import { getPendingImagesCount } from 'core/admin/actions';
import forIn from 'lodash.forin';

export default opts => {
  let pendingUpdatesList = [];

  forIn(opts.pendingUpdates, (updates, category) => {
    let pendingUpdates = [];
    let categoryContainer;
    // Create list items
    forIn(updates, (update, subCategory) => {
      if (Object.keys(update).length > 0) {
        let pendingCount = Object.keys(update).length;
        if (subCategory === 'images') {
          pendingCount = getPendingImagesCount(update);
        }
        pendingUpdates.push((
          <p key={`pendingUpdates-${subCategory}`} className="admin-pending_subcategory">{subCategory} - {pendingCount}</p>
        ));
      }
    });

    if (pendingUpdates) {
      categoryContainer = (
        <div key={`pendingUpdates-${category}`} className="category__container"><h3>{category}</h3>{pendingUpdates}</div>
        );
      // Push new container onto list of components
      pendingUpdatesList.push(categoryContainer);
    }
  });

  return pendingUpdatesList.length > 0 ? pendingUpdatesList : null;
};
