import React from 'react';
import forIn from 'lodash.forin';

export default articles => {
  let elements = [];
  forIn(articles, element => {
    if (element) {
      const id = element.id;
      const title = element.pendingtitle ? element.pendingtitle : element.title;
      const publisher = element.pendingpublisher ? element.pendingpublisher : element.publisher;
      const content = element.pendingcontent ? element.pendingcontent : element.content;
      const src = element.pendingsrc ? element.pendingsrc : element.src;
      elements.push(
        <div key={id} className="article" data-textedittargetparent>
          <h2 data-texteditid={`title-${id}`} data-textedittarget>{title}</h2>
          <h4 data-texteditid={`publisher-${id}`} data-textedittarget>{publisher}</h4>
          <p className="article__content" data-texteditid={`content-${id}`} data-textedittarget data-textedittype="textarea">{content}</p>
          <a href={src} target="_blank" className="article__link">Read Full Story</a>
        </div>
      );
    }
  });
  return elements;
};
