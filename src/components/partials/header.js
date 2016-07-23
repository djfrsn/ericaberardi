import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { adminActions } from 'core/admin';
import { galleriesActions } from 'core/galleries';
import { toastActions } from 'core/toast';
const toastr = require('react-toastr-redux/lib');

const {ToastContainer} = toastr;
const ToastMessageFactory = React.createFactory(toastr.ToastMessage.animation);

function getDigits(digits) {
  let digitsType = 'singledigits';

  if (digits > 9) {
    digitsType = 'doubledigits';
  }
  else if (digits > 99) {
    digitsType = 'tripledigits';
  }

  return digitsType;
}

export class Header extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };
  static propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clearToast: PropTypes.func.isRequired,
    galleries: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    toast: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.toast(nextProps);
    const highlightGalleriesLink = nextProps.galleries.highlightGalleriesLink;
    if (highlightGalleriesLink !== this.props.galleries.highlightGalleriesLink) {
      this.toggleHighlightGalleriesLink(highlightGalleriesLink);
    }
  }
  toast = nextProps => {
    if (nextProps.toast.toastType && !nextProps.toast.toastComplete) {
      this.props.clearToast();
      this.toastContainer[nextProps.toast.toastType](
        nextProps.toast.secondLine,
        nextProps.toast.firstLine, {
          timeOut: 7000,
          extendedTimeOut: 12000
        }
      );
    }
  }
  toggleHighlightGalleriesLink = on => {
    let link = ReactDOM.findDOMNode(this.galleriesLink);
    const hdrLink = 'header__link';
    link.className = on ? `${hdrLink} active` : hdrLink;
  }
  onSignOut = () => {
    this.props.signOut(this.context.router);
  }
  reRender = () => {
    this.forceUpdate(); // ugly hack since activeClassName works interminttenly
  }
  render() {
    const { auth, admin } = this.props;
    const pendingUpdatesCount = admin.pendingUpdatesCount;
    const digits = getDigits(pendingUpdatesCount);
    const dashboardLinkClass = classNames({ ['header__link']: true, ['hasPendingUpdates']: pendingUpdatesCount > 0, [digits]: digits === 'singledigits' ? false : true });
    return (
      <header className="header">
        <div className="g-row">
          <div className="g-col header__wrapper">
            <Link to="/" onClick={this.reRender} className="home__link" >
              <img className="header__logo" src="https://firebasestorage.googleapis.com/v0/b/erica-berardi.appspot.com/o/EB_LOGO.png?alt=media&token=237df6b3-5e19-44b2-9888-20b65ce7c2d8"/>
              <h1 className="header__title">Photography</h1>
            </Link>
            <ul className="header__links">
              <li><Link to="/galleries" className="header__link" onClick={this.reRender} ref={ref => { this.galleriesLink = ref; }}>Galleries</Link></li>
              <li><Link to="/news-reporting" className="header__link" onClick={this.reRender} activeClassName="active">News Reporting</Link></li>
              <li><Link to="/pricing" className="header__link" onClick={this.reRender} activeClassName="active">Pricing</Link></li>
              <li><Link to="/about" className="header__link" onClick={this.reRender} activeClassName="active">About</Link></li>
              <li><Link to="/contact" className="header__link" onClick={this.reRender} activeClassName="active">Contact</Link></li>
              {auth.authenticated ? <li><Link to="/dashboard" className={dashboardLinkClass} onClick={this.reRender} activeClassName="active" data-pendingupdatescount={pendingUpdatesCount}>Dashboard</Link></li> : null}
              {auth.authenticated ? <li><Link to="/" className="header__link" onClick={this.onSignOut} >Sign out</Link></li> : null}
            </ul>
          </div>
        </div>
        <ToastContainer ref={ref => this.toastContainer = ref} toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
      </header>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  admin: state.admin,
  galleries: state.galleries,
  toast: state.toast
}), Object.assign({}, authActions, adminActions, galleriesActions, toastActions))(Header);
