import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import { contactActions } from 'core/contact';
import { textEditCanvas } from 'helpers/textEdit';
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
  allFieldsHaveValues: false,
  ...intialErrorsState
};

export class Contact extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
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
  textEditTargetReverted = opts => {
    // let dispatchType;
    // let valueChanged = false;
    // let data = {};
    // if (opts.meta.type === 'about') {
    //   dispatchType = 'editAbout';
    //   const parsedAbout = parseAbout({ newAbout: opts.data, prevAbout: this.props.about, scope: this });
    //   valueChanged = !parsedAbout.equal;
    //   data = { about: parsedAbout.newAbout };
    // }

    // if (valueChanged) {
    //   this.props[dispatchType](data); // update db with changes
    // }
    this.setState({ ...this.state, isEditing: false });
  }
  editContact = e => {
    textEditCanvas({
      e,
      className: 'textEdit-contact',
      inputParent: 'li',
      callback: this.textEditTargetReverted,
      meta: { type: 'contact' }
    });
    this.setState({ ...this.state, isEditing: true});
  }
  onIconSrcChange = e => {
    const currentTarget = e.currentTarget;
    this.setState({
      ...this.state,
      [currentTarget.dataset.type]: {
        ...this.state.profilepicture,
        [`${currentTarget.dataset.type}-src-${currentTarget.dataset.id}`]: currentTarget.value
      }
    });
  }
  render() {
    const { auth } = this.props;
    const contact = { hello: 'hi' };
    const authenticated = auth.authenticated;
    const { nameError, emailError, subjectError, textareaError, allFieldsHaveValues } = this.state;
    const contactNameClass = classNames({ ['contact__name']: true, ['eb__input_error']: nameError });
    const contactEmailClass = classNames({ ['contact__email']: true, ['eb__input_error']: emailError });
    const contactSubjectClass = classNames({ ['contact__subject']: true, ['eb__input_error']: subjectError });
    const contactTextAreaClass = classNames({ ['contact__textarea']: true, ['eb__input_error']: textareaError });
    const recaptchaClass = classNames({ ['g-recaptcha']: true, ['hidden']: !allFieldsHaveValues });
    let socialIconsEditingInputs = null;
    if (this.state.isEditing) {
      socialIconsEditingInputs = (<div>
        <label htmlFor="facebookicon">Facebook Link</label>
        <input type="text" id="facebookicon" data-type="facebook" onChange={this.onIconSrcChange}/>
        <label htmlFor="twittericon">Twitter Link</label>
        <input type="text" id="twittericon" data-type="twitter" onChange={this.onIconSrcChange}/>
        <label htmlFor="instagramicon">Instagram Link</label>
        <input type="text" id="instagramicon" data-type="instagram" onChange={this.onIconSrcChange}/>
        <label htmlFor="googleicon">Google + Link</label>
        <input type="text" id="googleicon" data-type="google" onChange={this.onIconSrcChange}/>
      </div>);
    }
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="contact__container">
           {authenticated && Object.keys(contact).length > 0 ? <i onClick={this.editContact} className="fa fa-pencil-square-o page_edit_icon" aria-hidden="true"></i> : null}
            <form onSubmit={this.sendEmail} className="contact__form" data-textedittargetparent>
              <h2 className="contact__form_title" data-textedittarget data-texteditid="contact__form_title">Nice to meet you!</h2>
              <input data-contact-type="Name" type="text" placeholder="Name" className={contactNameClass} value={this.state.contactName} onChange={this.handleChange} ref={ref => { this.contactName = ref; }}/>
              <input data-contact-type="Email" type="text" placeholder="Email" className={contactEmailClass} value={this.state.contactEmail} onChange={this.handleChange} ref={ref => { this.contactEmail = ref; }}/>
              <input data-contact-type="Subject" type="text" placeholder="Subject" className={contactSubjectClass} value={this.state.contactSubject} onChange={this.handleChange} ref={ref => { this.contactSubject = ref; }}/>
              <textarea data-contact-type="Message" name="message" placeholder="Message" className={contactTextAreaClass} value={this.state.contactMessage} onChange={this.handleChange} ref={ref => { this.contactMessage = ref; }} />
              <div className={recaptchaClass} data-sitekey="6LeaQyQTAAAAADVFB5FGzAv-0d6Qsf_ZJoznUq1c"></div>
              <button onClick={this.sendEmail} className="contact__send">Send</button>
            </form>
            <div className="contact__social" data-textedittargetparent>
              <a href="mailto:ericaberardiphotography@gmail.com" className="contact__email-link" data-textedittarget data-texteditid="contact__email-link">ericaberardiphotography@gmail.com</a>
              {socialIcons({ className: 'contact__page'})}
              {socialIconsEditingInputs}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  contact: state.contact,
  toast: state.toast
}), Object.assign({}, authActions, toastActions, contactActions))(Contact);
