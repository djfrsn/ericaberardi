import {
  HYDRATE_NEWS_REPORTING
} from './action-types';
import forIn from 'lodash.forin';

export function hydrateNewsReporting(data) {
  return dispatch => {
    dispatch({
      type: HYDRATE_NEWS_REPORTING,
      payload: data
    });
  };
}

export function editArticles(opts) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const articles = opts.articles;
    const storage = firebase.storage();
    const database = firebase.database();
    database.ref('newsReporting/articles').set(articles);

    // upload any pending files
    forIn(articles, article => {
      const pendingfile = article.pendingfile;
      if (pendingfile) {
        // ensure files aren't above 850k
        if (pendingfile.size < 850000) {
          const storageRef = storage.ref().child(article.id); // name of folder
          const imageRef = storageRef.child(pendingfile.name); // name of file
          const uploadDoc = imageRef.put(pendingfile);

          uploadDoc.on('state_changed', null, null, () => {
            // Handle successful uploads on complete
            const id = firebase.database('newsReporting/articles').ref().child(`${article.id}`).push().key;
            const src = uploadDoc.snapshot.downloadURL;
            const docMeta = uploadDoc.snapshot.metadata;
            const { contentType, downloadURLs, fullPath, name, size, timeCreated } = docMeta;
            const imageData = { id, src, publisher: article.publisher, articleId: article.id, contentType, downloadURLs, fullPath, name, size, timeCreated };
            const newArticle = {
              ...article,
              pendingfile: imageData
            };

            // update meta
            database.ref(`newsReporting/articles/${article.id}`).set(newArticle);
          });
        }
      }
    });
  };
}

export function deleteArticleFile(pendingfile) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const storage = firebase.storage();
    const storageRef = storage.ref();
            console.log(pendingfile)
    // Create a reference to the file to delete
    const fileRef = storageRef.child(pendingfile.fullPath);
    fileRef.delete().then(() => {
      console.log('file deleted')
    });
  };
}

