import React from 'react';
// import * as gUtils from './galleriesUtils';

export default articles => {
  return articles.map(element => {
    return element ? (
      <div key={element.id} className="article">
        <h2>{element.title}</h2>
        <h4>{element.publisher}</h4>
        <p className="article__content">{element.content}</p>
        <a href={element.src} target="_blank" className="article__link">Read Full Story</a>
      </div>
      ) : null;
  });
};
