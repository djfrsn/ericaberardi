import React from 'react';
import { Link } from 'react-router';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

function getPackages(opts) {
  let packageDetails = [];
  const packagesProps = opts.props.pricing.packages;

  forIn(packagesProps, (packages) => {
    const details = packages.details;
    if (details) {
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
