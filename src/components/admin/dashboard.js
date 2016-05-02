import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { adminActions } from 'core/admin';

export class DashBoard extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deletePublishUpdates: PropTypes.func.isRequired,
    publishUpdates: PropTypes.func.isRequired
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.publishSuccess) {
      this.props.deletePublishUpdates(nextProps.admin.publishedChangesDeleteQueue);
    }
  }
  onPublish = () => {
    this.props.publishUpdates();
  }
  render() {
    const { auth, admin } = this.props;
    let component = <p style={{textAlign: 'center'}}><a href="/admin">Login</a> to use the dashboard.</p>;
    if (auth.authenticated) {
      const pendingUpdatesCount = admin.pendingUpdates.length;
      const pendingChangesTitle = pendingUpdatesCount >= 1 ? (<h3 className="pending-changes__title">Pending Changes</h3>) : null;
      const pendingCountList = pendingUpdatesCount >= 1 ? admin.pendingUpdates.map((update, index) => {
        return (<ul key={index} className="admin-pending_count"><li >{update.name} - {Object.keys(update.data).length}</li></ul>);
      }) : null;
      const publishButton = admin.pendingUpdates.length >= 1 ? (<button className="pending-changes__publish" onClick={this.onPublish}>Publish</button>) : null;
      component = (<div><h1 className="sign-in__heading">Admin DashBoard</h1>
        <div className="dashboard__wrapper">
          <Link to="changepassword" className="change-password__link" >Change Password</Link>
          <div className="pending-changes__wrapper">
            {pendingChangesTitle}
            {pendingCountList}
            {publishButton}
          </div>
        </div>
      </div>);
    }
    return (
      <div className="g-row dashboard">
        <div className="g-col">
          {component}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  admin: state.admin
}), Object.assign({}, authActions, adminActions))(DashBoard);
