import sweetalert from 'sweetalert';


function publishSweetAlert() {
  sweetalert({
    title: 'Live!',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates have been published!</span>',
    type: 'success',
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

export function confirmationAlert(scope) {
  sweetalert({
    title: 'Are you sure?',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">You will not be able to undo these changes!</span>',
    type: 'warning',
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
      scope.props.publishPendingUpdates(publishSweetAlert);
    }
    else {
      sweetalert({
        title: 'Cancelled',
        text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates are still pending :)</span>',
        type: 'error',
        html: true
      });
    }
  });
}

export function undoAlert(scope) {
  sweetalert({
    title: 'Are you sure?',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">You will not be able to retrieve your pending changes!</span>',
    type: 'warning',
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
        type: 'error',
        html: true
      });
    }
  });
}
