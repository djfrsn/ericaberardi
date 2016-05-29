import sweetalert from 'sweetalert';

export function publishSweetAlert() {
  sweetalert({
    title: 'Cancelled',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your content updates have been published!</span>',
    type: 'success',
    html: true
  });
}

export function undoSweetAlert() {
  sweetalert({
    title: 'Removed',
    text: '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">Your pending edits have been removed.</span>',
    type: 'success',
    html: true
  });
}
