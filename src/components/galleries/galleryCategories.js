import React from 'react';
import { Link } from 'react-router';

export default opts => {
  return opts.categories.map((category, key, list) => {
    const galleryLink = 'gallery__link';
    const pathAccepted = (opts.path === '/' ? list[0] : opts.path) === category; // if path is root, default to first category
    const className = pathAccepted ? `${galleryLink} active` : galleryLink;
    return category ? (
      <li key={key}><Link to={`/galleries/${category}`} className={className}>{category}</Link></li>
    ) : null;
  });
};
