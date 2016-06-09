import sweetalert from 'sweetalert';


function publishSweetAlert() {
  sweetalert({
    title: 'Live!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates have been published!</span>',
    type: 'success',
    html: true
  });
}

function publishErrorAlert() {
  sweetalert({
    title: 'Invalid content updates!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Try adding more content before publishing.</span>',
    type: 'error',
    html: true
  });
}

function undoSweetAlert() {
  sweetalert({
    title: 'Removed',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your pending edits have been removed.</span>',
    type: 'success',
    html: true
  });
}

function deleteSuccessAlert(category) {
  const categoryName = `<span style="text-transform: capitalize; font-weight: bold;">${category}</span>`;
  sweetalert({
    title: 'Success!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">' + categoryName + ' galleries deleted.</span>',
    type: 'success',
    html: true
  });
}

function deleteErrorAlert() {
  sweetalert({
    title: 'Unsuccessful!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Unfortunately something wen\"t wrong when trying to delete this category. Please try again :(</span>',
    type: 'error',
    html: true
  });
}

export function deleteGalleriesAlert(scope) {
  sweetalert({
    title: 'Delete Galleries Category',
    text: 'Type the name of a galleries category to delete it.',
    type: 'input',
    confirmButtonColor: '#d50d0d',
    confirmButtonText: 'Delete!',
    showCancelButton: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: 'Category Name'
  }, category => {
    if (category === false) return false;
    if (category === '') {
      sweetalert.showInputError('You need to write something!');
      return false;
    }
    scope.props.deleteGalleries({category, deleteSuccessAlert, deleteErrorAlert, sweetalert});
  });
}


function successAlert(type) {
  sweetalert({
    title: 'Success!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">' + type + ' successfully changed.</span>',
    type: 'success',
    html: true
  });
}

function errorAlert(error) {
  sweetalert({
    title: 'Unsuccessful!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">' + error.message + '</span>',
    type: 'error',
    html: true
  });
}

export function changePasswordAlert(scope) {
  sweetalert({
    title: 'Change Password',
    text: 'Type in your new password.',
    type: 'input',
    inputType: 'password',
    confirmButtonColor: '#93c577',
    confirmButtonText: 'Confirm',
    showCancelButton: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: '...'
  }, newPassword => {
    if (newPassword === false) return false;
    if (newPassword === '') {
      sweetalert.showInputError('An empty password...thats not too safe...try writing something!');
      return false;
    }
    scope.props.changePassword({newPassword, successAlert, errorAlert});
  });
}

export function changeEmailAlert(scope) {
  sweetalert({
    title: 'Change Email',
    text: 'Type in your new email address.',
    type: 'input',
    confirmButtonColor: '#93c577',
    confirmButtonText: 'Confirm',
    showCancelButton: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: '...'
  }, newEmail => {
    if (newEmail === false) return false;
    if (newEmail === '') {
      sweetalert.showInputError('You need to write something!');
      return false;
    }
    scope.props.changeEmail({newEmail, successAlert, errorAlert});
  });
}

export function confirmationAlert(scope) {
  sweetalert({
    title: 'Are you sure?',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">You will not be able to undo these changes!</span>',
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#93c577',
    confirmButtonText: 'Yes, publish!',
    cancelButtonText: 'No, I"ll Wait!',
    closeOnConfirm: false,
    closeOnCancel: false,
    showLoaderOnConfirm: true,
    html: true
  }, isConfirm => {
    if (isConfirm) {
      scope.props.publishPendingUpdates(publishSweetAlert, publishErrorAlert);
    }
    else {
      sweetalert({
        title: 'Cancelled',
        text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates are still pending :)</span>',
        type: 'success',
        html: true
      });
    }
  });
}

export function undoAlert(scope) {
  sweetalert({
    title: 'Are you sure?',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">You will not be able to retrieve your pending changes!</span>',
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#93c577',
    confirmButtonText: 'Yes, I"ll undo edits!',
    cancelButtonText: 'No, I"ll Wait!',
    closeOnConfirm: false,
    closeOnCancel: false,
    showLoaderOnConfirm: true,
    html: true
  }, isConfirm => {
    if (isConfirm) {
      scope.props.removePendingUpdates(undoSweetAlert);
    }
    else {
      sweetalert({
        title: 'Cancelled',
        text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates are still pending :)</span>',
        type: 'success',
        html: true
      });
    }
  });
}
