import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { galleryActions } from 'core/galleries';
import { toastActions } from 'core/toast';
const toastr = require('react-toastr-redux/lib');

const {ToastContainer} = toastr;
const ToastMessageFactory = React.createFactory(toastr.ToastMessage.animation);

export class Header extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
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
    if (nextProps.toast.toastType) {
      this.container[nextProps.toast.toastType](
        nextProps.toast.firstLine,
        nextProps.toast.secondLine, {
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
  reRender = () => {
    this.forceUpdate(); // ugly hack since activeClassName works interminttenly
  }
  render() {
    const { auth } = this.props;
    return (
      <header className="header">
        <div className="g-row">
          <div className="g-col">
            <Link to="/" onClick={this.reRender} className="home__link" >
              <h1 className="header__title">Erica Berardi</h1>
              <h2 className="header__sub_title">Photography <span>LLC</span></h2>
            </Link>
            <ul className="header__links">
              <li><Link to="/galleries" className="header__link" onClick={this.reRender} activeClassName="active" ref={ref => { this.galleriesLink = ref; }}>Galleries</Link></li>
              <li><Link to="/news-reporting" className="header__link" onClick={this.reRender} activeClassName="active">News Reporting</Link></li>
              <li><Link to="/pricing" className="header__link" onClick={this.reRender} activeClassName="active">Pricing</Link></li>
              <li><Link to="/about" className="header__link" onClick={this.reRender} activeClassName="active">About</Link></li>
              <li><Link to="/contact" className="header__link" onClick={this.reRender} activeClassName="active">Contact</Link></li>
              {auth.authenticated ? <li><Link to="dashboard" className="header__link" onClick={this.reRender} activeClassName="active">Dashboard</Link></li> : null}
              {auth.authenticated ? <li><Link to="/" className="header__link" onClick={this.props.signOut} >Sign out</Link></li> : null}
            </ul>
          </div>
        </div>
        <ToastContainer ref={ref => this.container = ref} toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
      </header>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  galleries: state.galleries,
  toast: state.toast
}), Object.assign({}, authActions, galleryActions, toastActions))(Header);
