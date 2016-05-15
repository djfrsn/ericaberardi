import React from 'react';
import { Link } from 'react-router';
import * as utils from './galleriesUtils';

export default opts => {
  return opts.categories.map((category, key) => {
    const { pathname } = opts.props.location;
    const path = utils.parsePath(pathname).path;
    const galleryLink = 'gallery__link';

    const className = (path === '/' ? 'commercial' : path) === category ? `${galleryLink} active` : galleryLink;
    return category ? (
      <li key={key}><Link to={`/galleries/${category}`} className={className}>{category}</Link></li>
    ) : null;
  });
};
