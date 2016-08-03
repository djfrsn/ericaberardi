import {
  HYDRATE_ABOUT
} from './action-types';
import forIn from 'lodash.forin';

export function hydrateAbout(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_ABOUT,
      payload: data
    });
  };
}

export function editAbout(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const about = opts.about;
    const storage = firebase.storage();
    const database = firebase.database();

    forIn(about, (data, category) => {
      if (category === 'content') {
        database.ref('about/content').set(data);
      }
      // upload new profilepicture or resume
      if ((category === 'profilepicture' || category === 'resume') && Object.keys(data).length > 0) {
        const filedata = data[Object.keys(data)[0]];
        const pendingfile = filedata.pendingfile;
        // upload pending file
        if (pendingfile) {
            // ensure files aren't above 850k
          if (pendingfile.size < 600000) {
            const storageRef = storage.ref().child(filedata.id); // name of folder
            const fileRef = storageRef.child(pendingfile.name); // name of file
            const uploadFile = fileRef.put(pendingfile);

            uploadFile.on('state_changed', null, null, () => {
              // Handle successful uploads on complete
              const id = firebase.database(`about/${category}`).ref().child(`${filedata.id}`).push().key;
              const src = uploadFile.snapshot.downloadURL;
              const docMeta = uploadFile.snapshot.metadata;
              const { contentType, downloadURLs, fullPath, name, size, timeCreated } = docMeta;
              const imageData = { id, src, [`${category}Id`]: filedata.id, contentType, downloadURLs, fullPath, name, size, timeCreated };
              const newFileData = {
                ...filedata,
                pendingsrc: src,
                pendingfile: imageData,
                pendingfiledeleted: null
              };

              // update meta
              database.ref(`about/${category}/${filedata.id}`).set(newFileData);
            });
          }
        }
      }
    });
  };
}

export function deleteAboutFile(prevAbout) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const storage = firebase.storage();
    const storageRef = storage.ref();
    // Create a reference to the file to delete
    const fileRef = storageRef.child(prevAbout.pendingfile.fullPath);
    fileRef.delete();
  };
}

