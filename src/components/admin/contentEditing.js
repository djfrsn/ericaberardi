import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { contentEditingActions } from 'core/contentEditing';
import { authActions } from 'core/auth';
import { parsePath } from 'lava';
import forIn from 'lodash.forin';
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
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };
  componentWillMount() {
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
    this.defaultCategory = 'news-reporting';
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    this.path = parsePath(pathname).path;

    const routeChange = pathname !== this.path || pathname === '/content-editing';

    if (routeChange) {
      this.path = parsePath(pathname).path;
    }
  }
  componentWillUnmount() {
    this.path = '';
  }
  render() {
    const { auth, contentEditing } = this.props;
    let component = <p style={{textAlign: 'center', marginTop: '60px'}}><Link to="/login">Login</Link> to edit content.</p>;
    if (auth.authenticated) {
      let contentEditingLinks = [];
      forIn(contentEditing.content, (content, category, allcontent) => {
        const defaultClassName = 'dashboard__link';
        const contentArray = Object.keys(allcontent);
        const includeDivider = contentArray[contentArray.length - 1] !== category;
        const linkClassName = this.path === 'content-editing' && category === this.defaultCategory || this.path === category ? `${defaultClassName} active` : defaultClassName;
        contentEditingLinks.push(
          <div key={`contentLink-${category}`}>
            <Link to={`/content-editing/${category}`} className={linkClassName}>{category}</Link>
            {includeDivider ? <span className="dashboard__link_divider">&#8226;</span> : null}
          </div>
          );
      });
      component = (<div>
        <div className="route__links">
          {contentEditingLinks}
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
