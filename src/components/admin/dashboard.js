import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import cn from 'classnames';
import { authActions } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleriesActions } from 'core/galleries';
import { toastActions } from 'core/toast';
import pendingUpdatesList from './pendingUpdatesList';
import { confirmationAlert, undoAlert, deleteGalleriesCategoryAlert, changeEmailAlert, changePasswordAlert } from './dashboardAlerts';

export class DashBoard extends Component {
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    changeEmail: PropTypes.func.isRequired,
    clearAdminToast: PropTypes.func.isRequired,
    deleteGalleriesCategory: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    publishPendingUpdates: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
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
  changeEmail = () => {
    changeEmailAlert(this);
  }
  changePassword = () => {
    changePasswordAlert(this);
  }
  deleteGalleriesCategory = e => {
    deleteGalleriesCategoryAlert(this, e.currentTarget.dataset.type );
  }
  confirmUndo = () => {
    undoAlert(this);
  }
  render() {
    const { auth, admin } = this.props;
    let dashboard = <p style={{textAlign: 'center'}}><a href="/login">Login</a> to use the dashboard.</p>;
    if (auth.authenticated) {
      const pendingUpdatesCount = Object.keys(admin.pendingUpdates).length;
      const hasPendingUpdates = pendingUpdatesCount >= 1;
      const pendingChangesClass = cn({['pending-changes__wrapper']: true, ['hidden']: !hasPendingUpdates });
      const pendingUpdatesTitle = hasPendingUpdates ? (<h3 className="pending-changes__title">Pending Content Updates</h3>) : null;
      const publishButton = hasPendingUpdates ? (<button className="eb-button pending-changes__publish" onClick={this.confirmPublish}>Publish</button>) : null;
      const clearEditsButton = hasPendingUpdates ? (<button className="eb-button pending-changes__undo" onClick={this.confirmUndo}>Undo Edits</button>) : null;
      dashboard = (<div><h1 className="dashboard__header">Admin DashBoard</h1>
        <div className="dashboard__wrapper">
          <Link to="/customer-galleries" className="dashboard__link" >Customer Galleries</Link>
          <span className="dashboard__link_break"></span>
          <a href="#" className="dashboard__link" onClick={this.deleteGalleriesCategory} data-type="customerGalleries">Delete Customer Galleries Category</a>
          <span className="dashboard__link_divider">&#8226;</span>
          <a href="#" className="dashboard__link" onClick={this.deleteGalleriesCategory}>Delete Public Galleries Category</a>
          <span className="dashboard__link_break"></span>
          <a onClick={this.changeEmail} className="dashboard__link" >Change Email</a>
          <span className="dashboard__link_divider">&#8226;</span>
          <a onClick={this.changePassword} className="dashboard__link" >Change Password</a>
          <div className={pendingChangesClass}>
            {pendingUpdatesTitle}
            <div className="pending-changes__list_wrapper">
              {pendingUpdatesList({ pendingUpdates: admin.pendingUpdates, scope: this })}
            </div>
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
          {dashboard}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  admin: state.admin,
  galleries: state.galleries
}), Object.assign({}, authActions, adminActions, galleriesActions, toastActions))(DashBoard);
