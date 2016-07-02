import React from 'react';
import forIn from 'lodash.forin';
import findKey from 'lodash.findkey';

function getPackages(opts) {
  const authenticated = opts.scope.props.auth.authenticated;
  const packagesProps = opts.props.pricing.packages;
  let packagesList = [];
  let defaultPkgId = findKey(opts.props.pricing.categories, { orderBy: '1'});
  forIn(packagesProps, category => {
    const packages = category.packages;
    const activePkgs = (opts.category === 'pricing' ? defaultPkgId : opts.category) === category.categoryId;
    if (activePkgs) { // check for active category based on browser path & create packagesList
      forIn(packages, (pkg, pkgId) => {
        let packageDetails = [];
        let pendingTitle = pkg.pendingTitle;
        packageDetails.push(<li key={`pkg-title-${pkgId}`} data-texteditid={pkgId} data-textedittarget>{pendingTitle && authenticated ? pendingTitle : pkg.title}</li>); // pkg title
        const pkgDetails = pkg.pendingDetails ? pkg.pendingDetails : pkg.details;
        forIn(pkgDetails, detail => {
          packageDetails.push(
            <li key={detail.id} data-texteditid={detail.id} data-textedittarget>{detail.text}</li> // list of pkg details
          );
        });
        packagesList.push(<ul key={pkgId} id={pkg.categoryId} data-textedittargetparent className="pricing__package_list">
          {packageDetails}
        </ul>); // create array of ul's for each pkg i.ePackage A, Package B, ...
      });
    }
  });

  return packagesList;
}

export default opts => {
  const packages = getPackages(opts);
  return packages;
};
