import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import { contactActions } from 'core/contact';
import classNames from 'classnames';

const intialErrorsState = {
  nameError: false,
  emailError: false,
  textareaError: false
};

const initialState = {
  contactName: '',
  contactEmail: '',
  contactMessage: '',
  ...intialErrorsState
};

export class Contact extends Component {
  static propTypes = {
    clearContactToast: PropTypes.func.isRequired,
    contact: PropTypes.object.isRequired,
    sendEmail: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  }
  state = initialState
  componentWillReceiveProps(nextProps) {
    const { err } = nextProps.contact.email;

    if (nextProps.contact.email.success) {
      this.onEmailSuccess();
    }
    if (err.length > 0) {
      this.onEmailError(err);
    }
  }
  handleChange = e => {
    this.setState({...this.state, [`contact${e.target.dataset.contactType}`]: e.target.value});
  }
  onEmailError = err => {
    this.props.clearContactToast(); // toast must be cleared before showToast is called...
    let errors = {};
    err.forEach(toast => {
      errors[`${toast.errName}Error`] = true;
      setTimeout(() => { // avoid overloading the toast plugin w/ setTimeout
        this.props.showToast(toast);
      }, 150);
    });
    this.setState({ ...this.state, ...errors});
    setTimeout(() => { // clear errors
      this.setState({ ...this.state, ...intialErrorsState});
    }, 7000);
  }
  onEmailSuccess = () => {
    this.props.clearContactToast();
    this.resetFormInputs();
    this.setState(initialState);
    this.props.showToast({
      firstLine: 'Success!',
      secondLine: 'Erica will be receiving your email shortly, thank you!.',
      type: 'success'
    });
  }
  sendEmail = () => {
    const { contactName, contactEmail, contactMessage } = this.state;
    this.props.sendEmail({ contactName, contactEmail, contactMessage});
  }
  render() {
    const { nameError, emailError, textareaError } = this.state;
    const contactNameClass = classNames({ ['contact__name']: true, ['contact__input_error']: nameError });
    const contactEmailClass = classNames({ ['contact__email']: true, ['contact__input_error']: emailError });
    const contactTextAreaClass = classNames({ ['contact__textarea']: true, ['contact__input_error']: textareaError });
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="contact__container">
            <div className="contact__form">
              <h2 className="contact__form_title">Nice to meet you!</h2>
              <input data-contact-type="Name" type="text" placeholder="Name" className={contactNameClass} value={this.state.contactName} onChange={this.handleChange} ref={ref => { this.contactName = ref; }}/>
              <input data-contact-type="Email" type="text" placeholder="Email" className={contactEmailClass} value={this.state.contactEmail} onChange={this.handleChange} ref={ref => { this.contactEmail = ref; }}/>
              <textarea data-contact-type="Message" name="message" placeholder="Message" className={contactTextAreaClass} value={this.state.contactMessage} onChange={this.handleChange} ref={ref => { this.contactMessage = ref; }} />
              <button onClick={this.sendEmail} className="contact__send">Send</button>
            </div>
            <div className="contact__social">
              <a href="mailto:ericamarieowen@yahoo.com" className="contact__email-link">ericamarieowen@yahoo.com</a>
              <div className="contact__social_icons">
                <a href="#" className="contact__social_link"><i className="fa fa-facebook-official" aria-hidden="true"></i></a>
                <a href="#" className="contact__social_link"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                <a href="#" className="contact__social_link"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                <a href="#" className="contact__social_link"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  contact: state.contact,
  toast: state.toast
}), Object.assign({}, authActions, toastActions, contactActions))(Contact);
