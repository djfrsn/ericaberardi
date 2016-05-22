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
              <h2>Nice to meet you!</h2>
              <input type="text" placeholder="Name" className="contact__name"/>
              <input type="text" placeholder="Email" className="contact__email"/>
              <textarea name="message" placeholder="Message" />
              <button className="contact__send">Send</button>
            </div>
            <div className="contact__social">
              <a href="mailto:ericamarieowen@yahoo.com" className="contact__email-link">ericamarieowen@yahoo.com</a>
              <a href="#" className="contact__social_link"><i className="fa fa-facebook-official" aria-hidden="true"></i></a>
              <a href="#" className="contact__social_link"><i className="fa fa-twitter" aria-hidden="true"></i></a>
              <a href="#" className="contact__social_link"><i className="fa fa-instagram" aria-hidden="true"></i></a>
              <a href="#" className="contact__social_link"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, authActions)(Contact);
