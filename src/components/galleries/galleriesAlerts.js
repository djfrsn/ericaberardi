import sweetalert from 'sweetalert';


function publishSweetAlert(type = 'success', text = 'Your content updates have been published!') {
  sweetalert({
    title: 'Live!',
    text: `<span style="font-size: 1.2em; color:rgb(31, 31, 31);">${text}</span>`,
    type: type,
    html: true
  });
}

export function deleteImagesAlert(scope) {
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
      scope.props.onGalleryDeleteImages(publishSweetAlert);
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
