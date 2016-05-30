import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newsReportingActions } from 'core/newsReporting';
import articles from './articles';

export class NewsReporting extends Component {
  static propTypes = {
    newsReporting: PropTypes.object.isRequired
  }
  render() {
    const data = this.props.newsReporting.articles;
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="articles__container">
            {articles(data)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  newsReporting: state.newsReporting
}), Object.assign({}, newsReportingActions))(NewsReporting);
