import forIn from 'lodash.forin';
// determine if about data has changed & update text/files with pending data if so
export default function(opts) {
  let equal = true;
  let newAbout = {
    content: {},
    resume: {},
    profilepicture: {}
  };
  // Check text for any changes
  forIn(opts.newAbout, (about, type) => {
    const typeData = type.split('-');
    const aboutType = typeData[0];
    const aboutId = typeData[1];
    const prevAbout = opts.prevAbout[aboutType][aboutId];

    if (!newAbout[aboutType][aboutId]) {
      newAbout[aboutType][aboutId] = { ...prevAbout }; // create new about object
    }
    const prevText = prevAbout.pendingcontent ? prevAbout.pendingcontent : prevAbout.content; // use pendingcontent or original content
    if (about.text !== prevText) { // for comparison with about.text
      newAbout[aboutType][aboutId].pending = true; // update about with pending text
      newAbout[aboutType][aboutId][`pending${aboutType}`] = about.text;
      equal = false;
    }
  });

  const aboutProps = opts.scope.props.about;

  const checkSrc = options => {
    forIn(options.aboutProps[options.type], data => {
      const newDataSrc = opts.scope.state[options.type][`${[options.type]}-src-${data.id}`];
      if (newDataSrc) {
        newAbout[options.type][data.id] = { ...data };
        newAbout[options.type][data.id].pending = true;
        newAbout[options.type][data.id].pendingsrc = newDataSrc;
        equal = false;
      }
    });
  };

  const checkFiles = options => {
    forIn(options.aboutProps[options.type], data => {
      let dataId = data.id;
      let type = options.type;
      let prevAbout = opts.prevAbout[type][dataId];

      // check to see if file has been uploaded
      let newFile = opts.scope.state[type][`${type}-file-${dataId}`];
      if (newFile) {
        newAbout[type][dataId] = { ...data }; // get id & existing src
        // delete existing pending files without the same name to avoid keeping files
        if (prevAbout.pendingfile) { // if the user uploads mutiple files for the same about before publishing/undoEdits
          if (prevAbout.pendingfile.name !== newFile.name) {
            const prevPendingFile = prevAbout.pendingfile;
            if (prevPendingFile.fullPath && !newAbout[type][dataId].pendingfiledeleted) {
              newAbout[type][dataId].pendingfiledeleted = true; // if the user is replacing an already pending file
              opts.scope.props.deleteAboutFile(prevAbout); // we should delete the previous pending file
            }
          }
        }
        newAbout[type][dataId].pending = true;
        newAbout[type][dataId].pendingsrc = newFile.preview;
        newAbout[type][dataId].pendingfile = newFile;
        equal = false;
      }
    });
  };
  // Determine if src text has changed
  checkSrc({ aboutProps, type: 'resume' });
  checkSrc({ aboutProps, type: 'profilepicture' });
  // Determine if any new files have been uploaded
  checkFiles({ aboutProps, type: 'resume' });
  checkFiles({ aboutProps, type: 'profilepicture' });

  return { equal, newAbout };
}
