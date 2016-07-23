import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { aboutActions } from 'core/about';
import { textEditCanvas } from 'helpers/textEdit';
import content from './content';
import forIn from 'lodash.forin';
// determine if articles have changed & update articles with pending data if so
function parseArticles(opts) {
  let equal = true;
  let newArticles = {};

  forIn(opts.newArticles, (article, type) => {
    const typeData = type.split('-');
    const articleType = typeData[0];
    const articleId = typeData[1];
    const prevArticle = opts.prevArticles[articleId];
    if (!newArticles[articleId]) {
      newArticles[articleId] = { ...prevArticle }; // create new article object
    }
    const prevText = prevArticle[articleType];
    if (article.text !== prevText) {
      newArticles[articleId].pending = true; // update article with pending text
      newArticles[articleId][`pending${articleType}`] = article.text;
      equal = false;
    }
    // check if link src
    const newSrc = opts.scope.state.articleSrcs[`src-${articleId}`];
    if (newSrc) {
      newArticles[articleId].pending = true;
      newArticles[articleId].pendingsrc = newSrc;
      equal = false;
    }
    // check to see if file has been uploaded
    let newFile = opts.scope.state.files[`file-${articleId}`];
    if (newFile) {
      // delete existing pending files without the same name to avoid keeping files
      if (prevArticle.pendingfile) { // if the user uploads mutiple files for the same article before publishing/undoEdits
        if (prevArticle.pendingfile.name !== newFile.name) {
          const prevPendingFile = prevArticle.pendingfile;
          if (prevPendingFile.fullPath && !newArticles[articleId].pendingfiledeleted) {
            newArticles[articleId].pendingfiledeleted = true; // if the user is replacing an already pending file
            opts.scope.props.deleteArticleFile(prevArticle); // we should delete the previous pending file
          }
        }
      }
      newFile = newFile[0];
      newArticles[articleId].pending = true;
      newArticles[articleId].pendingsrc = `File Upload [${newFile.name}]`;
      newArticles[articleId].pendingfile = newFile;
      equal = false;
    }
  });

  return { equal, newArticles };
}

export class About extends Component {
  static propTypes = {
    about: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteArticleFile: PropTypes.func.isRequired,
    editArticles: PropTypes.func.isRequired
  }
  textEditTargetReverted = opts => {
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'articles') {
      dispatchType = 'editArticles';
      const parsedArticles = parseArticles({ newArticles: opts.data, prevArticles: this.props.about.content, scope: this });
      valueChanged = !parsedArticles.equal;
      data = { articles: parsedArticles.newArticles };
    }

    if (valueChanged) {
      this.props[dispatchType](data); // update db with changes
    }
    this.setState({ ...this.state, isEditing: false, files: {}, articleSrcs: {} });
  }
  editAbout = e => {
    textEditCanvas({
      e,
      className: 'textEdit-about',
      inputParent: 'li',
      callback: this.textEditTargetReverted,
      meta: { type: 'articles' }
    });
    this.setState({ ...this.state, isEditing: true});
  }
  render() {
    const { about } = this.props;
    const authenticated = this.props.auth.authenticated;
    const resumeEl = [];
    forIn(about.resume, resume => {
      if (resume) {
        resumeEl.push(<a key={resume.id} href={resume.src} target="_blank" className="about__resume_link">{resume.linktext}</a>);
      }
    });
    const aboutImage = [];
    forIn(about.profilepicture, picture => {
      if (picture) {
        aboutImage.push(<img key={picture.id} className="about__image" src={picture.src}/>);
      }
    });
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="about__container">
            {authenticated && Object.keys(about.content).length > 0 ? <i onClick={this.editAbout} className="fa fa-pencil-square-o newsreporting_article_edit" aria-hidden="true"></i> : null}
            <div className="about__left_col">
              <div className="about__content">
                {content(about.content)}
                {resumeEl}
              </div>
            </div>
            <div className="about__right_col">
              {aboutImage}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  about: state.about
}), Object.assign({}, authActions, aboutActions))(About);
