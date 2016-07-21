import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { contentEditingActions } from 'core/contentEditing';
import { authActions } from 'core/auth';
import displayContent from './displayContent';

// strategy.
// init_editing_data to load up props contentEditing.routeName
// list hard coded links for each route
// display data
// add textEdit to data inputs

export class ContentEditing extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
    contentEditing: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  render() {
    const { auth, contentEditing } = this.props;
    let component = <p style={{textAlign: 'center', marginTop: '60px'}}><Link to="/login">Login</Link> to edit content.</p>;
    if (auth.authenticated) {
      component = (<div>
        <div className="route__links">
          <a href="#" className="dashboard__link" data-type="customerGalleries">News Reporting</a>
          <span className="dashboard__link_divider">&#8226;</span>
          <a href="#" className="dashboard__link" data-type="customerGalleries">Pricing</a>
          <span className="dashboard__link_divider">&#8226;</span>
          <a href="#" className="dashboard__link" data-type="customerGalleries">About</a>
          <span className="dashboard__link_divider">&#8226;</span>
          <a href="#" className="dashboard__link" data-type="customerGalleries">Contact</a>
        </div>
        <div className="active__content">{displayContent({ content: contentEditing.content, scope: this})}</div>
      </div>);
    }
    return (
      <div className="g-row content-editing">
        <div className="g-col">
          <h1 className="page__heading">Content Editing</h1>
          {component}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  contentEditing: state.contentEditing
}), Object.assign({}, authActions, contentEditingActions))(ContentEditing);
