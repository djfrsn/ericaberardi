import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleryActions } from 'core/galleries';
import { toastActions } from 'core/toast';
import pendingUpdatesList from './pendingUpdatesList';
import { confirmationAlert, undoAlert } from './dashboardAlerts';

export class DashBoard extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clearAdminToast: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    publishPendingUpdates: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    undoPendingUpdates: PropTypes.func.isRequired
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.toast.type) {
      this.props.clearAdminToast();
      this.props.showToast(nextProps.admin.toast);
    }
  }
  confirmPublish = () => {
    confirmationAlert(this);
  }
  confirmUndo = () => {
    undoAlert(this);
  }
  render() {
    const { auth, admin } = this.props;
    let component = <p style={{textAlign: 'center'}}><a href="/login">Login</a> to use the dashboard.</p>;
    if (auth.authenticated) {
      const pendingUpdatesCount = Object.keys(admin.pendingUpdates).length;
      const hasPendingUpdates = pendingUpdatesCount >= 1;
      const pendingUpdatesTitle = hasPendingUpdates ? (<h3 className="pending-changes__title">Pending Content Updates</h3>) : null;
      const publishButton = hasPendingUpdates ? (<button className="eb-button pending-changes__publish" onClick={this.confirmPublish}>Publish</button>) : null;
      const clearEditsButton = hasPendingUpdates ? (<button className="eb-button pending-changes__undo" onClick={this.confirmUndo}>Undo Edits</button>) : null;
      component = (<div><h1 className="sign-in__heading">Admin DashBoard</h1>
        <div className="dashboard__wrapper">
          <Link to="changepassword" className="change-password__link" >Change Password</Link>
          <div className="pending-changes__wrapper">
            {pendingUpdatesTitle}
            {pendingUpdatesList({ pendingUpdates: admin.pendingUpdates, scope: this })}
            <div className="eb-button__container">
              {clearEditsButton}
              {publishButton}
            </div>
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

// strategy
// bring in galleries state
// see if updates exist
// if so show the affected galleries and list of images, size, & count for each category
// also show the publish button
// confirm with modal before allowing publish.....use animations.css or something similar for modal animation

export default connect(state => ({
  auth: state.auth,
  admin: state.admin,
  galleries: state.galleries
}), Object.assign({}, authActions, adminActions, galleryActions, toastActions))(DashBoard);
