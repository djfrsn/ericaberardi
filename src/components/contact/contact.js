import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { toastActions } from 'core/toast';
import { contactActions } from 'core/contact';
import { textEditCanvas } from 'helpers/textEdit';
import parseContact from './parseContact';
import forEach from 'lodash.foreach';
import forIn from 'lodash.forin';
import delay from 'lodash.delay';
import SocialIcons from '../partials/socialIcons';
import classNames from 'classnames';

const intialErrorsState = {
  nameError: false,
  emailError: false,
  subjectError: false,
  textareaError: false
};

const initialState = {
  socialicons: {},
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
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'contact') {
      dispatchType = 'editContact';
      const parsedContact = parseContact({ newContact: opts.data, prevContact: this.props.contact, scope: this });
      valueChanged = !parsedContact.equal;
      data = { contact: parsedContact.newContact };
    }

    if (valueChanged) {
      this.props[dispatchType](data); // update db with changes
    }
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
      socialicons: {
        ...this.state.profilepicture,
        [currentTarget.dataset.id]: { src: currentTarget.value }
      }
    });
  }
  render() {
    const { auth, contact } = this.props;
    const contentAvailable = Object.keys(contact.content).length > 0;
    const contactFormTitleId = contentAvailable ? Object.keys(contact.content.form)[0] : '';
    let contactFormTitle = contentAvailable ? contact.content.form[contactFormTitleId].text : '';
    const emailId = contentAvailable ? Object.keys(contact.content.email)[0] : '';
    let contactEmail = contentAvailable ? contact.content.email[emailId].text : '';
    const authenticated = auth.authenticated;
    if (authenticated && contentAvailable) {
      contactFormTitle = contact.content.form[contactFormTitleId].pendingtext ? contact.content.form[contactFormTitleId].pendingtext : contactFormTitle;
      contactEmail = contact.content.email[emailId].pendingtext ? contact.content.email[emailId].pendingtext : contactEmail;
    }
    const { nameError, emailError, subjectError, textareaError } = this.state; // , allFieldsHaveValues
    const contactContainerClass = this.state.isEditing ? 'contact__container isEditing' : 'contact__container';
    const contactNameClass = classNames({ ['contact__name']: true, ['eb__input_error']: nameError });
    const contactEmailClass = classNames({ ['contact__email']: true, ['eb__input_error']: emailError });
    const contactSubjectClass = classNames({ ['contact__subject']: true, ['eb__input_error']: subjectError });
    const contactTextAreaClass = classNames({ ['contact__textarea']: true, ['eb__input_error']: textareaError });
    const recaptchaClass = classNames({ ['g-recaptcha']: true, ['hidden']: true }); // normal value for hidden: !allFieldsHaveValues
    let socialIconsEditingInputs = null;
    if (this.state.isEditing) {
      socialIconsEditingInputs = [];
      forIn(contact.content.socialicons, icon => {
        const iconSrc = icon.pendingsrc ? icon.pendingsrc : icon.src;
        socialIconsEditingInputs.push(<div key={icon.id}>
          <label className="socialicons__input_label" htmlFor={`${icon.type}icon`}>{icon.type}</label>
          <input className="textEdit-input" type="text" id={`${icon.type}icon`} data-type={icon.type} data-id={icon.id} placeholder={iconSrc} defaultValue={iconSrc} onChange={this.onIconSrcChange}/>
        </div>);
      });
    }
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className={contactContainerClass}>
           {authenticated && contentAvailable ? <i onClick={this.editContact} className="fa fa-pencil-square-o page_edit_icon" aria-hidden="true"></i> : null}
            {contentAvailable ? <form onSubmit={this.sendEmail} className="contact__form" data-textedittargetparent>
              {this.state.isEditing ? <label className="email__greeting_label">Greeting Message</label> : null}
              <h2 className="contact__form_title" data-textedittarget data-texteditid={`form-${contactFormTitleId}`}>{contactFormTitle}</h2>
              {!this.state.isEditing ? <div><input data-contact-type="Name" type="text" placeholder="Name" className={contactNameClass} value={this.state.contactName} onChange={this.handleChange} ref={ref => { this.contactName = ref; }}/>
                <input data-contact-type="Email" type="text" placeholder="Email" className={contactEmailClass} value={this.state.contactEmail} onChange={this.handleChange} ref={ref => { this.contactEmail = ref; }}/>
                <input data-contact-type="Subject" type="text" placeholder="Subject" className={contactSubjectClass} value={this.state.contactSubject} onChange={this.handleChange} ref={ref => { this.contactSubject = ref; }}/>
                <textarea data-contact-type="Message" name="message" placeholder="Message" className={contactTextAreaClass} value={this.state.contactMessage} onChange={this.handleChange} ref={ref => { this.contactMessage = ref; }} />
                <div className={recaptchaClass} data-sitekey="6LeaQyQTAAAAADVFB5FGzAv-0d6Qsf_ZJoznUq1c"></div>
                <button onClick={this.sendEmail} className="contact__send">Send</button></div> : null}
            </form> : null}
            <div className="contact__social" data-textedittargetparent>
              <a href={`mailto:${contactEmail}`} className="contact__email-link" data-textedittarget data-texteditid={`email-${emailId}`}>{contactEmail}</a>
              {!this.state.isEditing ? <SocialIcons selectorName="contact__page"/> : null}
              {this.state.isEditing ? <label className="socialicons__input_label">Social Icon Links</label> : null}
              {socialIconsEditingInputs}
              {this.state.isEditing ? <label className="email__input_label">Email Link</label> : null}
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
