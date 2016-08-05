import forIn from 'lodash.forin';

// determine if articles have changed & update articles with pending data if so
export default opts => {
  let equal = true;
  let newArticles = {};

  forIn(opts.newArticles, (article, type) => {
    const typeData = type.split('-');
    const articleType = typeData[0];
    const articleId = typeData[1];
    const prevArticle = opts.prevArticles[articleId];
    if (!newArticles[articleId]) {
      newArticles[articleId] = { ...prevArticle }; // create new article object
    }
    const prevText = prevArticle[articleType];
    if (article.text !== prevText) {
      newArticles[articleId].pending = true; // update article with pending text
      newArticles[articleId][`pending${articleType}`] = article.text;
      equal = false;
    }
    // check if link src
    const newSrc = opts.scope.state.articleSrcs[`src-${articleId}`];
    if (newSrc) {
      newArticles[articleId].pending = true;
      newArticles[articleId].pendingsrc = newSrc;
      equal = false;
    }
    // check to see if file has been uploaded
    let newFile = opts.scope.state.files[`file-${articleId}`];
    if (newFile) {
      // delete existing pending files without the same name to avoid keeping files
      if (prevArticle.pendingfile) { // if the user uploads mutiple files for the same article before publishing/undoEdits
        if (prevArticle.pendingfile.name !== newFile.name) {
          const prevPendingFile = prevArticle.pendingfile;
          if (prevPendingFile.fullPath && !newArticles[articleId].pendingfiledeleted) {
            newArticles[articleId].pendingfiledeleted = true; // if the user is replacing an already pending file
            opts.scope.props.deleteArticleFile(prevArticle); // we should delete the previous pending file
          }
        }
      }
      newFile = newFile[0];
      newArticles[articleId].pending = true;
      newArticles[articleId].pendingsrc = `File Upload [${newFile.name}]`;
      newArticles[articleId].pendingfile = newFile;
      equal = false;
    }
  });

  return { equal, newArticles };
};
