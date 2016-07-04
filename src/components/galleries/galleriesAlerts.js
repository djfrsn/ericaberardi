import sweetalert from 'sweetalert';
import forEach from 'lodash.foreach';

function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Byte';
  const k = 1000; // or 1024 for binary
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function publishSweetAlert(type = 'success', text = 'Image deletion successful!') {
  sweetalert({
    title: 'Live!',
    text: `<span style="font-size: 1.2em; color:rgb(31, 31, 31);">${text}</span>`,
    type: type,
    html: true
  });
}

export function unapprovedUploadAlert(unapprovedFiles, type) {
  let unapprovedFilesNames = '';
  const unapprovedFilesLength = unapprovedFiles.length - 1;
  const filesWord = unapprovedFilesLength > 0 ? 'files\'s' : 'file';
  const imagesWord = unapprovedFilesLength > 0 ? 'images\'s' : 'image';
  const multipleFilesHelp = unapprovedFilesLength > 0 ? '(look for Additional Options: Multiple Pics)' : '';

  forEach(unapprovedFiles, (file, key) => {
    const comma = key < unapprovedFilesLength ? ', ' : '';
    unapprovedFilesNames += `<span style="font-weight: bold">${file.name}(${formatBytes(file.size, 1)})${comma}</span>`;
  });

  const text = '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">The following ' + filesWord + ' couldn\'t be uploaded: ' + unapprovedFilesNames + ' due to file size limitations.</span></br>'
    + '</br><span style="font-size: 1.2em; color:rgb(31, 31, 31);">To reduce file size try the following:.</span></br>'
    + '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">1.Use <a href="http://picresize.com" target="_blank">picresize.com</a>' + multipleFilesHelp + ' and resize  ' + imagesWord + '  to 1466px width.</span></br>'
    + '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">2.Compress ' + imagesWord + ' at <a href="https://tinypng.com/" target="_blank">tinypng.com</a>.</span></br>'
    + '<span style="font-size: 1.2em; color:rgb(31, 31, 31);">3.Try uploading your ' + imagesWord + ' again.</span></br>';

  sweetalert({
    title: type === 'zip' ? 'File size limit is 150 MB!' : 'File size limit is 600 KB!',
    text: text,
    type: 'error',
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
    confirmButtonText: 'Yes, delete!',
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
