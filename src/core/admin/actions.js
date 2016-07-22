import {
  CLEAR_ADMIN_TOAST,
  SET_PENDING_UPDATES,
  CLEAR_PENDING_UPDATES
} from './action-types';
import forIn from 'lodash.forin';
import delay from 'lodash.delay';
import findKey from 'lodash.findkey';
import utils from 'utils';
// TODO: Any functions not exported should be organized into js files by page(galleries, pricing)

function successCB(cb) {
  if (utils.isFunction(cb)) {
    return cb(); // call final publish/success callback
  }
}

export function clearAdminToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_ADMIN_TOAST
    });
  };
}

export function deleteGalleriesCategory(opts) {
  return (dispatch, getState) => {
    const { firebase, galleries, customerGalleries } = getState();
    const isCustomerGalleries = opts.galleriesType === 'customerGalleries';
    const galleriesType = isCustomerGalleries ? 'customerGalleries' : 'galleries';
    const galleriesProp = isCustomerGalleries ? customerGalleries : galleries;
    const database = firebase.database();
    const storage = firebase.storage();
    const categoryName = opts.category.toLowerCase();
    const categoryId = findKey(galleriesProp.categories, { category: categoryName });

    const successCallback = () => {
      opts.deleteSuccessAlert(categoryName);
    };

    if (categoryId) {
      const changesValidated = validatePendingChanges({ state: galleriesProp, category: galleriesType, parent: 'categories', child: 'images'}); // ensure galleries minimums are met before allowing a cateogry to be deleted
      if (changesValidated) {
        // STEP 1: Delete category
        database.ref(`${galleriesType}/categories/${categoryId}`).set(null).then(() => {
          successCallback();
        }).catch(() => {
          opts.deleteErrorAlert();
        });
        // STEP 2: Delete images from storage
        forIn(galleriesProp.images, imageCategory => {
          if (imageCategory) {
            forIn(imageCategory, image => {
              if (image) {
                storage.ref().child(image.fullPath).delete().catch(error => {
                  database.ref(`logs/errors/${galleriesType}/shouldDelete/images/${image.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${image.fullPath}`, error});
                });
              }
            });
          }
        });
        // STEP 3: Delete images meta data
        database.ref(`${galleriesType}/images/${categoryId}`).set(null).catch(error => {
          // we failed to delete a categories images.....log error
          database.ref(`logs/errors/${galleriesType}/shouldDelete/${categoryId}`).set({functionName: 'deleteGalleriesCategory', 'info': `This was a failure for deleting the following data: galleries/images/${categoryId}`, error});
        });
        // STEP 4: Delete zip from storage
        const zip = galleriesProp.zip[categoryId];
        if (zip) {
          storage.ref().child(zip.fullPath).delete().catch(error => {
            database.ref(`logs/errors/${galleriesType}/shouldDelete/zip/${zip.id}`).set({functionName: 'removePendingGalleriesData', 'info': `This was a failure for deleting the following data: ${zip.fullPath}`, error});
          });
          // Delete zip meta data
          database.ref(`${galleriesType}/zip/${categoryId}`).set(null).catch(error => {
            // we failed to delete a categories images.....log error
            database.ref(`logs/errors/${galleriesType}/shouldDelete/${categoryId}`).set({functionName: 'deleteGalleriesCategory', 'info': `This was a failure for deleting the following data: galleries/zip/${categoryId}`, error});
          });
        }
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

function getPendingNewsReporting(pendingUpdates, opts) {
  forIn(opts.snapshot, prop => {
    let pendingProp = {};
    forIn(prop, (child, key) => {
      if (child.pending) {
        pendingProp[key] = child;
      }
    });
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
      pendingUpdates = getPendingNewsReporting(pendingUpdates, opts);
    }
    if (opts.category === 'newsReporting') {
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
        case 'newsReporting':
          dispatchPendingUpdates({dispatch, category, admin, snapshot});
          break;

        default:
      }
    }
  };
}

// TODO: refactor this into switch that calls functions that return newState for each category
// Function used to create new state on publish, this is a good place to reset/update data before publish
// Set 'pending: false' for each child of a given pendingUpdate category & do any other state updates before publshing to db
function getNewState(opts) {
  let newPendingState = { ...opts.state };

  if (opts.category === 'galleries') {
    newPendingState[opts.child] = { ...opts.state[opts.child] }; // extend to avoid losing data other than objects
    forIn(opts.state[opts.parent], parent => {
      const parentId = parent.id;
      newPendingState[opts.parent][parentId] = { ...parent, pending: false }; // create new parent
      const children = opts.state[opts.child][parentId]; // looks for galleries/images/:id
      if (children) {
        forIn(children, child => { // add each new image to new state
          newPendingState[opts.child][parentId][child.id] = {...child, pending: false, shouldDelete: null };
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
      let newChild = newPendingState[opts.child][parentId] = {...child, pending: false};
      if (child.pending) { // crawl packages data for anything pending and create a new package
        forIn(child.packages, pkg => {
          const details = pkg.pendingDetails ? pkg.pendingDetails : pkg.details;
          const title = pkg.pendingTitle ? pkg.pendingTitle : pkg.title;
          pkg.pendingDetails = null; // clear key's from firebase data
          pkg.pendingTitle = null;
          newChild.packages[pkg.id] = { ...pkg, details, title };
        });
      }
    });
  }
  else if (opts.category === 'newsReporting') {
    newPendingState[opts.parent] = { ...opts.state[opts.parent] }; // extend to avoid losing data other than objects
    forIn(opts.state[opts.parent], parent => {
      const parentId = parent.id;
      newPendingState[opts.parent][parentId] = { ...parent, pending: false };
      if (parent.pending) { // update article if it's pending
        newPendingState[opts.parent][parentId] = {
          ...newPendingState[opts.parent][parentId],
          title: parent.pendingtitle ? parent.pendingtitle : parent.title,
          publisher: parent.pendingpublisher ? parent.pendingpublisher : parent.publisher,
          content: parent.pendingcontent ? parent.pendingcontent : parent.content,
          pendingtitle: null,
          pendingpublisher: null,
          pendingcontent: null
        };
      }
    });
  }

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

    case 'customerGalleries':
      minParentCount = 0;
      minChildCount = 0;
      break;

    case 'pricing':
      minParentCount = 3;
      minChildCount = 1;
      break;

    case 'newsReporting':
      minParentCount = 3;
      minChildCount = 0;
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
  const categories = ['galleries', 'customerGalleries', 'pricing', 'newsReporting', 'about'];

  if (categories.indexOf(opts.category) >= 0) {
    const parent = opts.state[opts.parent];
    const parentCount = Object.keys(parent).length;
    if (parentCount >= minParentCount) {
      let stateValid = true;
      let index = 1;

      if (opts.child) {
        forIn(parent, child => {
          const children = opts.state[opts.child][child.id] || {};
          if (Object.keys(children).length < minChildCount && index <= minParentCount) {
            stateValid = false;
          }
          index++;
        });
      }
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
      if (key) {
        database.ref(`${opts.category}/${key}`).set(newState[key]).then(() => {
          opts.dispatch({
            type: CLEAR_PENDING_UPDATES
          });
          if (opts.databaseKeys.length === callbackCount) {
            successCallback = opts.callbacks.successCallback;
            if (utils.isFunction(successCallback)) {
              delay(() => {
                successCallback(); // call final publish/success callback
              }, 0);
            }
          }
          callbackCount++;
        });
      }
    });
  }
  else {
    delay(() => {
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
        case 'newsReporting':
          publishContent({dispatch, getState, category, parent: 'articles', child: null, databaseKeys: ['articles'], state, callbacks});
          break;

        default:
      }

      callbackCount++;
    });
  };
}

function removePendingGalleriesData(opts) {
  const data = opts.data;
  const database = opts.firebase.database();
  const storage = opts.firebase.storage();
  let callbackCount = 1;
  let pendingGalleriesCount = 0;
  forIn(data, (dt, type) => {
    if (type !== 'images') {
      pendingGalleriesCount += Object.keys(dt).length;
    }
    else {
      forIn(dt, d => { // count separately since the data can be a little dirty here
        if (Object.keys(d).length > 0) { // make sure objects have keys(i.e meta data like a src attr, etc)
          pendingGalleriesCount += 1;
        }
      });
    }
  });

  // delete meta & delete img
  forIn(data, (data, subCategory) => {

    if (subCategory === 'categories') {
      // delete categories data
      forIn(data, category => {
        database.ref(`galleries/categories/${category.id}`).set(null).then(() => {
          if (pendingGalleriesCount === callbackCount) {
            successCB(opts.successCallback);
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
              if (pendingGalleriesCount === callbackCount) {
                successCB(opts.successCallback);
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

// We're going to set any pending data to null/false and then update the db
// this will clear any  pending updates for pricing page
function removePendingPricingData(opts) {

  const database = opts.firebase.database();
  let callbackCount = 1;
  let pendingPricingCount = 0;
  forIn(opts.data, dt => {
    pendingPricingCount += Object.keys(dt).length;
  });

  // set new pendingData for each packages/categories
  forIn(opts.data, (data, type) => {
    if (type === 'categories') { // is it a category or package?
      let newCat = {};
      forIn(data, cat => {
        if (cat.pending) {
          newCat = { ...cat, pending: false, pendingCategory: null };
          database.ref(`pricing/categories/${cat.id}`).set(newCat).then(() => {
            if (callbackCount === pendingPricingCount) {
              successCB(opts.successCallback);
            }
            callbackCount++;
          });
        }
      });
    }
    else if (type === 'packages') {
      forIn(data, pkgCat => {
        if (pkgCat.pending) {
          let newPkgCat = { ...pkgCat, pending: false };
          forIn(pkgCat.packages, pkg => {
            newPkgCat.packages[pkg.id] = {
              ...pkg,
              detailsPending: null,
              pendingDetails: null,
              pendingTitle: null
            };
          });
          database.ref(`pricing/packages/${pkgCat.categoryId}`).set(newPkgCat).then(() => {
            if (callbackCount === pendingPricingCount) {
              successCB(opts.successCallback);
            }
            callbackCount++;
          });
        }
      });
    }
  });
}

function removePendingnewsReportingData(opts) {

  const database = opts.firebase.database();
  let callbackCount = 1;
  let pendingNewsReportingCount = 0;
  forIn(opts.data, dt => {
    pendingNewsReportingCount += Object.keys(dt).length;
  });

  // set new pendingData for each packages/categories
  forIn(opts.data, (data, type) => {
    if (type === 'articles') { // is it a category or package?
      forIn(data, arti => {
        const newArticle = {
          ...arti,
          pending: false,
          pendingtitle: null,
          pendingpublisher: null,
          pendingcontent: null
        };
        database.ref(`newsReporting/articles/${arti.id}`).set(newArticle).then(() => {
          if (callbackCount === pendingNewsReportingCount) {
            successCB(opts.successCallback);
          }
          callbackCount++;
        });
      });

    }
  });
}

// General strategy
// check pending content by category & create new state without this data
export function removePendingUpdates(cb) {
  return (dispatch, getState) => {
    const { firebase, admin } = getState();
    const pendingUpdates = admin.pendingUpdates;
    const pendingUpdatesCount = admin.pendingUpdatesCount;
    const pendingUpdatesCategoryCount = Object.keys(pendingUpdates).length;
    let successCallback;
    let callbackCount = 1;
    if (Object.keys(pendingUpdates).length >= 1) {
      forIn(pendingUpdates, (data, category) => {
        // send successCallback for last pendingUpdates pass
        if (pendingUpdatesCategoryCount === callbackCount) { // pass publishCallback for final pass on pendingUpdates
          successCallback = cb;
        }
        switch (category) {
          case 'galleries':
            removePendingGalleriesData({firebase, data, dispatch, pendingUpdatesCount, successCallback});
            callbackCount++;
            break;
          case 'pricing':
            removePendingPricingData({firebase, data, dispatch, pendingUpdatesCount, successCallback});
            callbackCount++;
            break;
          case 'newsReporting':
            removePendingnewsReportingData({firebase, data, dispatch, pendingUpdatesCount, successCallback});
            callbackCount++;
            break;

          default:
        }
      });
    }
  };
}
