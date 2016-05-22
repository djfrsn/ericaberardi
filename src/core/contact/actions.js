import {
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_ERROR
} from './action-types';


function validateString(str, min, max) {
  return typeof str === 'string' && str.length >= min && str.length <= max;
}

function validateEmail(email) {
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
}

function validateEmailInputs(data) {
  let valid = true;
  let err = [];

  for (let prop in data) {
    if (prop.length > 0) {
      const dataCached = data[prop];
      switch (prop) {
        case 'contactName':
          if (!validateString(dataCached, 1, 150)) {
            valid = false;
            err.push({
              toast: {
                firstLine: 'Error!',
                secondLine: 'Your name is either too long or too short!.',
                type: 'error'
              }
            });
          }
          break;

        case 'contactEmail':
          if (!validateEmail(dataCached)) {
            valid = false;
            err.push({
              toast: {
                firstLine: 'Error!',
                secondLine: 'Please enter a valid email address!.',
                type: 'error'
              }
            });
          }
          break;

        case 'contactMessage':
          if (!validateString(dataCached, 1, 2000)) {
            valid = false;
            err.push({
              toast: {
                firstLine: 'Error!',
                secondLine: 'Your message is either too long or too short!.',
                type: 'error'
              }
            });
          }
          break;

        default:
      }
    }
  }

  return { valid, err };
}

export function sendEmail(data) {
  return dispatch => {
    const validation = validateEmailInputs(data);
    let dispatchVal = () => {};

    if (!validation.valid) {
      dispatchVal = dispatch({
        type: SEND_EMAIL_ERROR,
        payload: validation
      });
    }
    else {
      dispatchVal = dispatch({
        type: SEND_EMAIL_SUCCESS,
        payload: data
      });
    }

    return dispatchVal;
  };
}
