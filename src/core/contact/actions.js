import {
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_ERROR,
  CLEAR_EMAIL_DATA
} from './action-types';
import utils from 'utils';

function validateString(str, min, max) {
  let valid = false;
  let errType;

  if (typeof str === 'string') {
    if (str.length < min) {
      errType = 'min';
    }
    else if (str.length > max) {
      errType = 'max';
    }
    valid = typeof errType === 'undefined' ? true : false;
  }

  return { valid, errType };
}

function validateEmail(email) {
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
}


function validateEmailInputs(data) {
  let success = true;
  let err = [];
  let validate;

  for (let prop in data) {
    if (prop.length > 0) {
      switch (prop) {
        case 'contactName':
          validate = validateString(data[prop], 2, 150);
          if (!validate.valid) {
            success = false;
            err.push({
              firstLine: 'Error!',
              secondLine: validate.errType === 'min' ? 'Your name is too short!.' : 'Your name is too long!.',
              type: 'error',
              errName: 'name'
            });
          }
          break;

        case 'contactEmail':
          if (!validateEmail(data[prop])) {
            success = false;
            err.push({
              firstLine: 'Error!',
              secondLine: 'Please enter a valid email address!.',
              type: 'error',
              errName: 'email'
            });
          }
          break;

        case 'contactSubject':
          validate = validateString(data[prop], 2, 150);
          if (!validate.valid) {
            success = false;
            err.push({
              firstLine: 'Error!',
              secondLine: 'Please enter a valid subject!.',
              type: 'error',
              errName: 'subject'
            });
          }
          break;

        case 'contactMessage':
          validate = validateString(data[prop], 20, 2000);
          if (!validate.valid) {
            success = false;
            err.push({
              firstLine: 'Error!',
              secondLine: validate.errType === 'min' ? 'Your message is too short!.' : 'Your message is too long!.',
              type: 'error',
              errName: 'textarea'
            });
          }
          break;

        default:
      }
    }
  }

  return { success, err };
}

export function sendEmail(data) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const database = firebase.database();
    const validation = validateEmailInputs(data);

    if (!validation.success) {
      dispatch({
        type: SEND_EMAIL_ERROR,
        payload: { validation }
      });
    }
    else {
      const emailData = {
        fromEmail: data.contactEmail,
        fromName: data.contactName,
        subject: data.contactSubject,
        message: data.contactMessage
      };
      emailjs.send('postmark', 'template_m5wrGxSz', emailData).then(() => {
        database.ref(`logs/emails/${utils.uuid()}`).set(emailData);
        dispatch({
          type: SEND_EMAIL_SUCCESS,
          payload: { data: data, validation }
        });
      }, err => {
        const isCaptchaError = err.text ? JSON.parse(err.text).error.indexOf('CAPTCHA') >= 0 : null;
        dispatch({
          type: SEND_EMAIL_ERROR,
          payload: { validation: { success: false, err: {
            firstLine: 'Error!',
            secondLine: isCaptchaError ? 'Verify Captcha!' : 'Failed to send email! Please try again.',
            type: 'error',
            errName: 'sendEMail'
          } } }
        });
      });
    }
  };
}

export function clearContactToast() {
  return dispatch => {
    dispatch({
      type: CLEAR_EMAIL_DATA
    });
  };
}
