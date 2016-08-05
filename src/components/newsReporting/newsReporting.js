import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newsReportingActions } from 'core/newsReporting';
import { authActions } from 'core/auth';import articles from './articles';
import { textEditCanvas } from 'helpers/textEdit';
import parseArticles from './parseArticles';

export class NewsReporting extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    deleteArticleFile: PropTypes.func.isRequired,
    editArticles: PropTypes.func.isRequired,
    newsReporting: PropTypes.object.isRequired
  }
  state = { articleSrcs: {}, files: {} }
  onDrop(files) {
    if (!this.state.isDragReject) {
      this.props.onDropAccept(files, this.props.id); // eslint-disable-line react/prop-types
    } // this.props here is actually equal to props for Dropzone component
  }
  onDropAccept = (files, id) => {
    this.setState({
      files: {
        ...this.state.files,
        [`file-${id}`]: files
      }
    });
  }
  onArticleSrcChange = e => {
    const currentTarget = e.currentTarget;
    this.setState({
      ...this.state,
      articleSrcs: {
        ...this.state.articleSrcs,
        [`src-${currentTarget.dataset.articleid}`]: currentTarget.value
      }
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
      this.props[dispatchType](data); // update db with changes
    }
    this.setState({ ...this.state, isEditing: false, files: {}, articleSrcs: {} });
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
    const peiClass = 'fa fa-pencil-square-o page_edit_icon';
    const pageEditIconClass = this.state.isEditing ? `${peiClass} isEditing` : peiClass;
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="articles__container">
            {authenticated && Object.keys(data).length > 0 ? <i onClick={this.editArticles} className={pageEditIconClass} aria-hidden="true"></i> : null}
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
