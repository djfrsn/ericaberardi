import React from 'react';
import forIn from 'lodash.forin';

function getPackages(opts) {
  let packagesList = [];
  const packagesProps = opts.props.pricing.packages;

  forIn(packagesProps, (category, k, pkgs) => {
    const packages = category.packages;
    const defaultPkgs = pkgs[Object.keys(pkgs)[0]];
    const activePkgs = (opts.category === 'pricing' ? defaultPkgs.categoryId : opts.category) === category.categoryId;
    if (activePkgs) { // check for active category based on browser path & create packagesList
      forIn(packages, (pkg, i) => {
        let packageDetails = [];
        packageDetails.push(<li key={`pkg-title-${i}`}>{pkg.title}</li>); // pkg title
        forIn(pkg.details, (detail, key) => {
          packageDetails.push(
            <li key={key}>{detail}</li> // list of pkg details
          );
        });
        packagesList.push(<ul key={i} className="pricing__package_list">{packageDetails}</ul>); // create array of ul's for each pkg i.ePackage A, Package B, ...
      });
    }
  });

  return packagesList;
}

export default opts => {
  const packages = getPackages(opts);
  return packages;
};
