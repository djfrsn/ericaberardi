import React from 'react';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

export default content => {
  let elements = [];
  let sortedContent = [];
  forIn(content, element => {
    const content = element.pendingcontent ? element.pendingcontent : element.content;
    if (element) {
      elements.push(<p key={element.id} orderby={element.orderby} className="about__content__p" data-textedittarget data-texteditid={`content-${element.id}`} data-textedittype="textarea">{content}</p>);
    }
  });

  if (elements.length > 0) {
    forEach(elements, option => { // create new array with value as top lvl prop for easy sorting
      sortedContent.push({...option, value: option.props.orderby});
    });
    sortedContent = orderBy(sortedContent, 'value', 'asc');
  }
  return sortedContent;
};
