import React from 'react';
import forIn from 'lodash.forin';

function getPackages(opts) {
  const packagesProps = opts.props.pricing.packages;
  let packagesList = [];

  forIn(packagesProps, (category, k, pkgs) => {
    const packages = category.packages;
    const defaultPkgs = pkgs[Object.keys(pkgs)[0]];
    const activePkgs = (opts.category === 'pricing' ? defaultPkgs.categoryId : opts.category) === category.categoryId;
    if (activePkgs) { // check for active category based on browser path & create packagesList
      forIn(packages, (pkg, pkgId) => {
        let packageDetails = [];
        packageDetails.push(<li key={`pkg-title-${pkgId}`} data-texteditid={pkgId} data-textedittarget>{pkg.title}</li>); // pkg title
        forIn(pkg.details, (detail, key) => {
          packageDetails.push(
            <li key={key} data-texteditid={key} data-textedittarget>{detail}</li> // list of pkg details
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
