import React from 'react';
import forIn from 'lodash.forin';

export default opts => {
  let pendingUpdatesList = [];

  forIn(opts.pendingUpdates, (updates, category) => {
    let pendingUpdates = [];
    let categoryContainer;
    // Create list items
    forIn(updates, (update, subCategory) => {
      update.length > 0 ? pendingUpdates.push((
        <p key={`pendingUpdates-${subCategory}`} className="admin-pending_paragraph">{subCategory} - {update.length}</p>
      )) : null;
    });

    if (pendingUpdates) {
      categoryContainer = (
        <div key={`pendingUpdates-${category}`}  className="category__container"><h3>{category}</h3>{pendingUpdates}</div>
        );
      // Push new container onto list of components
      pendingUpdatesList.push(categoryContainer);
    }
  });

  return pendingUpdatesList.length > 0 ? pendingUpdatesList : null;
};
