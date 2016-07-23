import React from 'react';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

export default (content, scope) => {
  let elements = [];
 let sortedContent = [];
  forIn(content, element => {
    if (element) {
      elements.push(<p key={element.id} orderby={element.orderby} className="about__content__p">{element.text}</p>);
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
