import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import { contactActions } from 'core/contact';
import forEach from 'lodash.foreach';
import delay from 'lodash.delay';
import socialIcons from '../partials/socialIcons';
import classNames from 'classnames';

const intialErrorsState = {
  nameError: false,
  emailError: false,
  subjectError: false,
  textareaError: false
};

const initialState = {
  contactName: '',
  contactEmail: '',
  contactSubject: '',
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
    let allFieldsHaveValues = true;
    const formInputs = ['Name', 'Email', 'Subject', 'Message'];
    forEach(formInputs, inputName => {
      if (this[`contact${inputName}`].value === '') {
        allFieldsHaveValues = false; // show recaptcha if we have all of our values
      }
    });
    this.setState({...this.state, [`contact${e.target.dataset.contactType}`]: e.target.value, allFieldsHaveValues });
  }
  onEmailError = err => {
    this.props.clearContactToast(); // toast must be cleared before showToast is called...
    let errors = {};
    err.forEach(toast => {
      errors[`${toast.errName}Error`] = true;
      delay(() => { // avoid overloading the toast plugin w/ delay
        this.props.showToast(toast);
      }, 150);
    });
    this.setState({ ...this.state, ...errors});
    delay(() => { // clear errors
      this.setState({ ...this.state, ...intialErrorsState});
    }, 7000);
  }
  onEmailSuccess = () => {
    this.props.clearContactToast();
    this.setState(initialState);
    this.props.showToast({
      firstLine: 'Success!',
      secondLine: 'Erica will be receiving your email shortly, thank you!.',
      type: 'success'
    });
  }
  sendEmail = e => {
    e.preventDefault();
    const { contactName, contactEmail, contactSubject, contactMessage } = this.state;
    this.props.sendEmail({ contactName, contactEmail, contactSubject, contactMessage});
  }
  render() {
    const { nameError, emailError, subjectError, textareaError, allFieldsHaveValues } = this.state;
    const contactNameClass = classNames({ ['contact__name']: true, ['eb__input_error']: nameError });
    const contactEmailClass = classNames({ ['contact__email']: true, ['eb__input_error']: emailError });
    const contactSubjectClass = classNames({ ['contact__subject']: true, ['eb__input_error']: subjectError });
    const contactTextAreaClass = classNames({ ['contact__textarea']: true, ['eb__input_error']: textareaError });
    const recaptchaClass = classNames({ ['g-recaptcha']: true, ['hidden']: !allFieldsHaveValues });
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="contact__container">
            <form onSubmit={this.sendEmail} className="contact__form">
              <h2 className="contact__form_title">Nice to meet you!</h2>
              <input data-contact-type="Name" type="text" placeholder="Name" className={contactNameClass} value={this.state.contactName} onChange={this.handleChange} ref={ref => { this.contactName = ref; }}/>
              <input data-contact-type="Email" type="text" placeholder="Email" className={contactEmailClass} value={this.state.contactEmail} onChange={this.handleChange} ref={ref => { this.contactEmail = ref; }}/>
              <input data-contact-type="Subject" type="text" placeholder="Subject" className={contactSubjectClass} value={this.state.contactSubject} onChange={this.handleChange} ref={ref => { this.contactSubject = ref; }}/>
              <textarea data-contact-type="Message" name="message" placeholder="Message" className={contactTextAreaClass} value={this.state.contactMessage} onChange={this.handleChange} ref={ref => { this.contactMessage = ref; }} />
              <div className={recaptchaClass} data-sitekey="6LeaQyQTAAAAADVFB5FGzAv-0d6Qsf_ZJoznUq1c"></div>
              <button onClick={this.sendEmail} className="contact__send">Send</button>
            </form>
            <div className="contact__social">
              <a href="mailto:ericaberardiphotography@gmail.com" className="contact__email-link">ericaberardiphotography@gmail.com</a>
              {socialIcons()}
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
