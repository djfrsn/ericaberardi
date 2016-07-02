import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES
} from './action-types';
import forIn from 'lodash.forin';
import findKey from 'lodash.findkey';
import utils from 'utils';

export function clearAdminToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_ADMIN_TOAST
    });
  };
}

export function deleteGalleriesCategory(opts) {
  return (dispatch, getState) => {
    const { firebase, galleries } = getState();
    const database = firebase.database();
    const categoryName = opts.category.toLowerCase();
    const categoryId = findKey(galleries.categories, { category: categoryName });
    let callbackCount = 0;

    const successCallback = () => {
      if (callbackCount > 1) {
        opts.deleteSuccessAlert(categoryName);
      }
    };

    if (categoryId) {
      const changesValidated = validatePendingChanges('galleries', galleries); // ensure galleries minimums are met before allowing a cateogry to be deleted
      if (changesValidated) {
        database.ref(`galleries/categories/${categoryId}`).set(null).then(() => {
          callbackCount++;
          successCallback();
        }).catch(() => {
          opts.deleteErrorAlert();
        });
        database.ref(`galleries/images/${categoryId}`).set(null).then(() => {
          callbackCount++;
          successCallback();
        }).catch(error => {
          // we failed to delete a categories images.....log error
          database.ref(`logs/errors/galleries/shouldDelete/${categoryId}`).set({functionName: 'deleteGalleriesCategory', 'info': `This was a failure for deleting the following data: galleries/images/${categoryId}`, error});
        });
      }
      else {
        opts.sweetalert({
          title: 'Error!',
          text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Try adding more galleries and images before deleting the ' + opts.category + ' gallery.</span>',
          type: 'error',
          html: true
        });
      }
    }
    else {
      opts.sweetalert.showInputError('This isn\"t a valid category name!');
    }
  };
}

function isCategories(key) {
  return key === 'categories';
}
// helper for obtaining pendingImages
function isImages(category, key) {
  return category === 'galleries' && key === 'images';
}

export function getPendingImagesCount(categories) {
  let pendingImagesCount = 0;

  forIn(categories, images => {
    pendingImagesCount += Object.keys(images).length;
  });

  return pendingImagesCount;
}

function getPendingUpdatesCount(pendingUpdates) {
  let pendingUpdatesCount = 0;

  forIn(pendingUpdates, (updates, category) => {
    forIn(updates, (update, key) => {
      if (isImages(category, key)) {
        pendingUpdatesCount += getPendingImagesCount(update);
      }
      else {
        pendingUpdatesCount += Object.keys(update).length;
      }
    });
  });

  return pendingUpdatesCount;
}

function getPendingImages(categories) {
  let pendingImages = {};

  forIn(categories, (images, key) => {
    if (Object.keys(images).length > 0) {
      pendingImages[key] = {}; // do images have keys? A category with no images wouldn't....
    }
    forIn(images, (image, id) => {
      if (image.pending) {
        pendingImages[key][id] = image;
      }
    });
  });

  return pendingImages;
}

function getPendingGalleries(pendingUpdates, opts) {

  forIn(opts.snapshot, (prop, key) => {
    let pendingProp = {};
    if (isCategories(key)) {
      forIn(prop, (child, key) => {
        if (child.pending) { // check for pending categories
          pendingProp[key] = child;
        }
      });
      const parentsPending = Object.keys(pendingProp).length > 0;
      if (parentsPending) {
        pendingUpdates[opts.category][key] = pendingProp; // update new pendingProp
      }
    }
    else if (isImages(opts.category, key)) { // images are nested differently than categories....
      const pendingImages = getPendingImages(prop);
      let hasPendingImages = false;
      forIn(pendingImages, images => {
        if (Object.keys(images).length > 0) {
          hasPendingImages = true;
        }
      });
      if (hasPendingImages) { // all pending data is stored flat by categories/key for easy counting of pending data
        pendingUpdates[opts.category][key] = getPendingImages(prop); // a special function is needed to extract pending images
      }
    }
  });

  return pendingUpdates;
}

function getPendingPricing(pendingUpdates, opts) {
  forIn(opts.snapshot, (prop, key) => {
    let pendingProp = {};
    forIn(prop, (child, key) => {
      if (child.pending) {
        pendingProp[key] = child;
      }
    });
    const propsPending = Object.keys(pendingProp).length > 0;
    if (propsPending) {
      pendingUpdates[opts.category][key] = pendingProp; // update new pendingProp
    }
  });

  return pendingUpdates;
}

// Updates are set based on routes in this shape { galleries: data, about: data, contact: data }
// each key/value pair contains all pending updates for each route
function dispatchPendingUpdates(opts) {
  let pendingUpdates = { ...opts.admin.pendingUpdates }; // apply current pending updates

  pendingUpdates[opts.category] = {}; // reset pending updates for a category

  if (Object.keys(opts.snapshot).length > 0) { // register pending updates if any exist
    // set any pending data onto pendingUpdates object by category
    if (opts.category === 'galleries') {
      pendingUpdates = getPendingGalleries(pendingUpdates, opts);
    }
    if (opts.category === 'pricing') {
      pendingUpdates = getPendingPricing(pendingUpdates, opts);
    }
  }

  const pendingUpdatesCount = getPendingUpdatesCount(pendingUpdates);
  // show available pending updates
  if (pendingUpdatesCount > 0) {
    pendingUpdates = (() => {
      let parsedPendingUpdates = {};
      forIn(pendingUpdates, (update, key) => {
        if (Object.keys(update).length > 0) {
          parsedPendingUpdates[key] = update;
        }
      });
      return parsedPendingUpdates;
    })(); // return only categories with updates
    opts.dispatch({
      type: SET_PENDING_UPDATES,
      payload: { pendingUpdates, pendingUpdatesCount }
    });
  }
  else {
    opts.dispatch({
      type: CLEAR_PENDING_UPDATES
    });
  }
}

// a category is based on a childUrl for the app routes i.e /about
export function setPendingUpdates(category, snapshot) {
  return (dispatch, getState) => {
    const { admin } = getState();

    if (snapshot) {
      switch (category) {
        case 'galleries':
          dispatchPendingUpdates({dispatch, category, admin, snapshot});
          break;
        case 'pricing':
          dispatchPendingUpdates({dispatch, category, admin, snapshot});
          break;

        default:
      }
    }
  };
}

// Set 'pending: false' for each child of a given pendingUpdate category & do any other state updates before publshing to db
function getNewState(opts) {
  let newPendingState = { ...opts.state };

  if (opts.category === 'galleries') {
    newPendingState[opts.child] = { ...opts.state[opts.child] }; // extend to avoid losing data other than objects
    forIn(opts.state[opts.parent], parent => {
      const parentId = parent.id;
      newPendingState[opts.parent][parentId] = { ...parent, pending: false };
      const children = opts.state[opts.child][parentId];
      if (children) {
        forIn(children, child => {
          newPendingState[opts.child][parentId][child.id] = {...child, pending: false};
        });
      }
    });
  }
  else if (opts.category === 'pricing') {
    newPendingState[opts.child] = { ...opts.state[opts.child] }; // extend to avoid losing data other than objects
    forIn(opts.state[opts.parent], parent => {
      const parentId = parent.id;
      const category = parent.pendingCategory ? parent.pendingCategory : parent.category;
      newPendingState[opts.parent][parentId] = { ...parent, category, pending: false };
      const child = opts.state[opts.child][parentId];
      if (child.pending) {
        debugger
      }
      newPendingState[opts.child][parentId] = {...child, pending: false};
    });
  }
debugger
  return newPendingState;
}

// Minimums for how many categorys/children should exist in the db
function getPendingChangeMinimums(category) {
  let minParentCount = 1;
  let minChildCount = 1;

  switch (category) {
    case 'galleries':
      minParentCount = 5;
      minChildCount = 4;
      break;

    case 'pricing':
      minParentCount = 3;
      minChildCount = 1;
      break;

    default:
  }

  return { minParentCount, minChildCount };
}

// Return true if pendingUpdate children meet minimum content count i.e there should always be atleast 5 gallery categories w/ atleast 8 photos each
// This will prevent a user from deleting all of the content from the site :)
function validatePendingChanges(opts) {
  const { minParentCount, minChildCount } = getPendingChangeMinimums(opts.category);
  let validChanges = false;

  if (opts.category === 'galleries' || opts.category === 'pricing') {
    const parent = opts.state[opts.parent];
    const parentCount = Object.keys(parent).length;
    if (parentCount >= minParentCount) {
      let stateValid = true;
      let index = 1;

      forIn(parent, child => {
        const children = opts.state[opts.child][child.id] || {};
        if (Object.keys(children).length < minChildCount && index <= minParentCount) {
          stateValid = false;
        }
        index++;
      });
      validChanges = stateValid;
    }
  }

  return validChanges;
}

// NOTE: This method should work for any category/page, data for each category/page must be structured similar for this to work
function publishContent(opts) {
  const { firebase } = opts.getState();
  const changesValidated = validatePendingChanges(opts);

  if (changesValidated) {
    const newState = getNewState({ category: opts.category, setStatus: false, state: opts.state, parent: opts.parent, child: opts.child }); // set pending status of all children to false
    const database = firebase.database();
    let callbackCount = 1;
    let successCallback;

    opts.databaseKeys.forEach(key => {
      // iterate through category children & set data in firebase
  console.log(`${opts.category}/${key}`, newState[key])
      // database.ref(`${opts.category}/${key}`).set(newState[key]).then(() => {
      //   opts.dispatch({
      //     type: CLEAR_PENDING_UPDATES
      //   });
      //   if (opts.databaseKeys.length === callbackCount) {
      //     successCallback = opts.callbacks.successCallback;
      //     if (utils.isFunction(successCallback)) {
      //       setTimeout(() => {
      //         successCallback(); // call final publish/success callback
      //       }, 0);
      //     }
      //   }
      //   callbackCount++;
      // });
    });
  }
  else {
    setTimeout(() => {
      if (utils.isFunction(opts.callbacks.errorCallback)) {
        opts.callbacks.errorCallback(); // show error alert
      }
    }, 0); // run at the end of the callstack to avoid sweetalert glitch
  }
}

export function publishPendingUpdates(successCallback, errorCallback) {
  return (dispatch, getState) => {
    const { admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesLength = Object.keys(pendingUpdates).length;
    let callbacks = {errorCallback};
    let callbackCount = 1;

    // loop through pendingUpdates & set state to firebase
    forIn(pendingUpdates, (update, category) => {
      // each route has it's own state and pending- state to hold data with user edits
      let state = { ...getState()[category] }; // get the pending state for a given category

      if (pendingUpdatesLength === callbackCount) { // pass publishCallback for final pass on pendingUpdates
        callbacks.successCallback = successCallback;
      }

      switch (category) {
        case 'galleries':
          publishContent({dispatch, getState, category, parent: 'categories', child: 'images', databaseKeys: ['categories', 'images'], state, callbacks});
          break;
        case 'pricing':
          publishContent({dispatch, getState, category, parent: 'categories', child: 'packages', databaseKeys: ['categories', 'packages'], state, callbacks});
          break;

        default:
      }

      callbackCount++;
    });
  };
}

function clearPendingUpdates(dispatch) {
  dispatch({
    type: CLEAR_PENDING_UPDATES
  });
}

function removePendingGalleriesData(opts) {
  const data = opts.data;
  const database = opts.firebase.database();
  const storage = opts.firebase.storage();
  let callbackCount = 1;
  // delete meta & delete img
  forIn(data, (data, subCategory) => {

    if (subCategory === 'categories') {
      // delete categories data
      forIn(data, category => {
        database.ref(`galleries/categories/${category.id}`).set(null).then(() => {
          if (opts.pendingUpdatesCount === callbackCount) {
            clearPendingUpdates(opts.dispatch);
            if (utils.isFunction(opts.successCallback)) {
              opts.successCallback(); // call final publish/success callback
            }
          }
          callbackCount++;
        }).catch(error => {
          database.ref(`logs/errors/galleries/shouldDelete/${category.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: galleries/categories/${category.id}`, error});
        });
      });
    }

    if (subCategory === 'images') {
      forIn(data, images => {
        if (Object.keys(images).length > 0) {
          forIn(images, image => {
            database.ref(`galleries/images/${image.categoryId}/${image.id}`).set(null).then(() => {
              if (opts.pendingUpdatesCount === callbackCount) {
                clearPendingUpdates(opts.dispatch);
                if (utils.isFunction(opts.successCallback)) {
                  opts.successCallback(); // call final publish/success callback
                }
              }
              callbackCount++;
            }).catch(error => {
              database.ref(`logs/errors/galleries/shouldDelete/${image.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: galleries/images/${image.categoryId}/${image.id}`, error});
            });
            storage.ref().child(image.fullPath).delete().catch(error => {
              database.ref(`logs/errors/galleries/shouldDelete/images/${image.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${image.fullPath}`, error});
            });
          });
        }
      });
    }

  });
}

// strategy
// check pending content by category & create new state without this data
export function removePendingUpdates(successCallback) {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesCount = admin.pendingUpdatesCount;
    if (Object.keys(pendingUpdates).length >= 1) {
      forIn(pendingUpdates, (data, category) => {
        if (category === 'galleries') {
          // delete pending categories, images & meta
          removePendingGalleriesData({firebase, data, dispatch, pendingUpdatesCount, successCallback});
        }
      });
    }
  };
}
