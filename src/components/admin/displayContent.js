import React from 'react';
import NewsReportingContent from './displayContentComponent/newsReportingContent';
import PricingContent from './displayContentComponent/pricingContent';

const displayContentComponent = {
  'news-reporting': <NewsReportingContent/>,
  pricing: <PricingContent/>
};

export default opts => {

  const content = opts.content;
  let displayContent = null;
  const defaultDisplayContent = content[Object.keys(content)[0]];
  const contentAvailable = Object.keys(defaultDisplayContent).length > 0;
  if (contentAvailable) {
    const currentCategory = opts.scope.path === 'content-editing' ? opts.scope.defaultCategory : opts.scope.path;
    const currentContent = content[currentCategory];
    if (Object.keys(currentContent).length > 0) {
      // display content based on selected category
      displayContent = displayContentComponent[currentCategory];
    }
  }

  return displayContent;
};
