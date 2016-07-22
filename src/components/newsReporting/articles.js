import React from 'react';
import forIn from 'lodash.forin';

export default articles => {
  let elements = [];
  forIn(articles, element => {
    if (element) {
      const id = element.id;
      elements.push(
        <div key={id} className="article" data-textedittargetparent>
          <h2 data-texteditid={id} data-textedittarget>{element.title}</h2>
          <h4 data-texteditid={id} data-textedittarget>{element.publisher}</h4>
          <p className="article__content" data-texteditid={id} data-textedittarget data-textedittype="textarea">{element.content}</p>
          <a href={element.src} target="_blank" className="article__link">Read Full Story</a>
        </div>
      );
    }
  });
  return elements;
};
