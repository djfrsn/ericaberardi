import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newsReportingActions } from 'core/newsReporting';
import { authActions } from 'core/auth';
import articles from './articles';
import { textEditCanvas } from 'helpers/textEdit';

function parseArticles(opts) {
  let parsedArticles = {};

  return parsedArticles;
}

export class NewsReporting extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    newsReporting: PropTypes.object.isRequired
  }
  textEditTargetReverted = opts => {
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'articles') {
      dispatchType = 'editArticles';
      const parsedArticles = parseArticles({ newArticles: opts.data, prevArticles: this.props.newsReporting.articles });
      valueChanged = !parsedArticles.equal;
      data = { newPkgsCategory: parsedArticles.newPkgsCategory };
    }

    if (valueChanged) {
      this.props[dispatchType](data);
    }
  }
  editArticles = e => {
    textEditCanvas({
      e,
      className: 'textEdit-article',
      inputParent: 'li',
      callback: this.textEditTargetReverted,
      meta: { type: 'articles' }
    });
  }
  render() {
    const authenticated = this.props.auth.authenticated;
    const data = this.props.newsReporting.articles;
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="articles__container">
            {authenticated && Object.keys(data).length > 0 ? <i onClick={this.editArticles} className="fa fa-pencil-square-o newsreporting_article_edit" aria-hidden="true"></i> : null}
            {articles(data)}
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
