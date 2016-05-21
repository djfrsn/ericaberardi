import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class Contact extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="contact__container">
            <div className="contact__form">
              <h1>Nice to meet you!</h1>
              <input type="text" className="contact__name"/>
              <input type="text" className="contact__email"/>
              <textarea name="message" value="Message*" />
              <button className="contact__send">Send</button>
            </div>
            <div className="contact__social">
              <a href="" className="contact__email-link">ericamarieowen@yahoo.com</a>
              <i className="fa fa-facebook-official" aria-hidden="true"></i>
              <i className="fa fa-twitter" aria-hidden="true"></i>
              <i className="fa fa-instagram" aria-hidden="true"></i>
              <i className="fa fa-google-plus" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(Contact);
