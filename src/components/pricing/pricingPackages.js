import React from 'react';
import forIn from 'lodash.forin';

function getPackages(opts) {
  let packageDetails = [];
  const packagesProps = opts.props.pricing.packages;

  forIn(packagesProps, (pkg, key, pkgs) => {
    const details = pkg.details;
    const defaultPkg = pkgs[Object.keys(pkgs)[0]];
    const activePkg = (opts.category === 'pricing' ? defaultPkg.categoryId : opts.category) === pkg.categoryId;
    if (activePkg) {
      forIn(details, (detail, key) => {
        packageDetails.push(
          <li key={key}>{detail}</li>
        );
      });
    }
  });

  return packageDetails;
}

export default opts => {
  const packages = getPackages(opts);
  return packages;
};
