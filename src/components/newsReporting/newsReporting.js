import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newsReportingActions } from 'core/newsReporting';
import { authActions } from 'core/auth';import articles from './articles';
import { textEditCanvas } from 'helpers/textEdit';
import forIn from 'lodash.forin';

// determine if articles have changed & update articles with pending data if so
function parseArticles(opts) {
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
    const newSrc = opts.scope.state[`src-${articleId}`];
    if (newSrc) {
      newArticles[articleId].pending = true;
      newArticles[articleId].pendingsrc = newSrc;
      equal = false;
    }
    // check to see if file has been uploaded
    let newFile = opts.scope.state[`file-${articleId}`];
    if (newFile) {
      if (newArticles[articleId].pendingfile) {
        // delete existing pending files without the same name
        if (newArticles[articleId].pendingfile.name !== newFile.name) {
          const prevPendingFile = newArticles[articleId].pendingfile;
          console.log(prevPendingFile, newFile);
          // TODO: actually get the prevPendingFile
          if (prevPendingFile.fullPath) { // is it a firebase file?
            opts.scope.props.deleteArticleFile(prevPendingFile);
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
}

export class NewsReporting extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    deleteArticleFile: PropTypes.func.isRequired,
    editArticles: PropTypes.func.isRequired,
    newsReporting: PropTypes.object.isRequired
  }
  state = {}
  onDrop(files) {
    if (!this.state.isDragReject) {
      this.props.onDropAccept(files, this.props.id); // eslint-disable-line react/prop-types
    } // this.props here is actually equal to props for Dropzone component
  }
  onDropAccept = (files, id) => {
    this.setState({
      [`file-${id}`]: files
    });
    // mime type images or docs
  }
  onArticleSrcChange = e => {
    const currentTarget = e.currentTarget;
    this.setState({
      ...this.state,
      [`src-${currentTarget.dataset.articleid}`]: currentTarget.value
    });
  }
  textEditTargetReverted = opts => {
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'articles') {
      dispatchType = 'editArticles';
      const parsedArticles = parseArticles({ newArticles: opts.data, prevArticles: this.props.newsReporting.articles, scope: this });
      valueChanged = !parsedArticles.equal;
      data = { articles: parsedArticles.newArticles };
    }

    if (valueChanged) {
      this.props[dispatchType](data);
    }
    this.setState({ ...this.state, isEditing: false});
  }
  editArticles = e => {
    textEditCanvas({
      e,
      className: 'textEdit-article',
      inputParent: 'li',
      callback: this.textEditTargetReverted,
      meta: { type: 'articles' }
    });
    this.setState({ ...this.state, isEditing: true});
  }
  render() {
    const authenticated = this.props.auth.authenticated;
    const data = this.props.newsReporting.articles;
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="articles__container">
            {authenticated && Object.keys(data).length > 0 ? <i onClick={this.editArticles} className="fa fa-pencil-square-o newsreporting_article_edit" aria-hidden="true"></i> : null}
            {articles(data, this)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  newsReporting: state.newsReporting
}), Object.assign({}, authActions, newsReportingActions))(NewsReporting);
