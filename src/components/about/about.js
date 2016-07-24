import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { aboutActions } from 'core/about';
import { textEditCanvas } from 'helpers/textEdit';
import content from './content';
import forIn from 'lodash.forin';
import Dropzone from 'react-dropzone';
// determine if about data has changed & update articles with pending data if so
function parseAbout(opts) {
  let equal = true;
  let newAbout = {
    content: {},
    resume: {},
    profilepicture: {}
  };

  forIn(opts.newAbout, (about, type) => {
    const typeData = type.split('-');
    const aboutType = typeData[0];
    const aboutId = typeData[1];
    const prevAbout = opts.prevAbout[aboutType][aboutId];

    if (!newAbout[aboutType][aboutId]) {
      newAbout[aboutType][aboutId] = { ...prevAbout }; // create new about object
    }
    const prevText = prevAbout.content;
    if (about.text !== prevText) {
      newAbout[aboutType][aboutId].pending = true; // update about with pending text
      newAbout[aboutType][aboutId][`pending${aboutType}`] = about.content;
      equal = false;
    }
    // TODO: refactor the next two sets of methods into two functions
    // // check if profile picture/resume src changed
    const newResumeSrc = opts.scope.state.resume[`resume-src-${aboutId}`];
    if (newResumeSrc) {
      newAbout[aboutType][aboutId].pending = true;
      newAbout[aboutType][aboutId].pendingsrc = newResumeSrc;
      equal = false;
    }
    const newProfilepictureSrc = opts.scope.state.profilepicture[`profilepicture-src-${aboutId}`];
    if (newProfilepictureSrc) {
      newAbout[aboutType][aboutId].pending = true;
      newAbout[aboutType][aboutId].pendingsrc = newProfilepictureSrc;
      equal = false;
    }
    debugger
    // check to see if file has been uploaded
    let newProfilePicture = opts.scope.state.profilepicture[`profilepicture-file-${aboutId}`];
    if (newProfilePicture) {
      // delete existing pending files without the same name to avoid keeping files
      if (prevAbout.pendingfile) { // if the user uploads mutiple files for the same about before publishing/undoEdits
        if (prevAbout.pendingfile.name !== newProfilePicture.name) {
          const prevPendingFile = prevAbout.pendingfile;
          if (prevPendingFile.fullPath && !newAbout[aboutType][aboutId].pendingfiledeleted) {
            newAbout[aboutType][aboutId].pendingfiledeleted = true; // if the user is replacing an already pending file
            opts.scope.props.deleteAboutFile(prevAbout); // we should delete the previous pending file
          }
        }
      }
      newProfilePicture = newProfilePicture[0];
      newAbout[aboutType][aboutId].pending = true;
      newAbout[aboutType][aboutId].pendingsrc = `File Upload [${newProfilePicture.name}]`;
      newAbout[aboutType][aboutId].pendingfile = newProfilePicture;
      equal = false;
    }
  });

  return { equal, newAbout };
}

export class About extends Component {
  static propTypes = {
    about: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAboutFile: PropTypes.func.isRequired,
    editAbout: PropTypes.func.isRequired
  }
  state = {
    resume: {},
    profilepicture: {}
  }
  onDrop(files) {
    if (!this.state.isDragReject) {
      this.props.onDropAccept(files, this.props.id); // eslint-disable-line react/prop-types
    } // this.props here is actually equal to props for Dropzone component
  }
  onDropAccept = (files, id) => {
    this.setState({
      files: {
        ...this.state.files,
        [`img-${id}`]: files
      }
    });
  }
  textEditTargetReverted = opts => {
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'about') {
      dispatchType = 'editAbout';
      const parsedAbout = parseAbout({ newAbout: opts.data, prevAbout: this.props.about, scope: this });
      valueChanged = !parsedAbout.equal;
      data = { about: parsedAbout.newAbout };
    }

    if (valueChanged) {
      this.props[dispatchType](data); // update db with changes
    }
    this.setState({ ...this.state, isEditing: false });
  }
  editAbout = e => {
    textEditCanvas({
      e,
      className: 'textEdit-about',
      inputParent: 'li',
      callback: this.textEditTargetReverted,
      meta: { type: 'about' }
    });
    this.setState({ ...this.state, isEditing: true});
  }
  onAboutSrcChange = e => {
    const currentTarget = e.currentTarget;
    this.setState({
      ...this.state,
      [currentTarget.dataset.type]: {
        ...this.state.profilepicture,
        [`${currentTarget.dataset.type}-src-${currentTarget.dataset.id}`]: currentTarget.value
      }
    });
  }
  render() {
    const { about, auth } = this.props;
    const authenticated = auth.authenticated;
    const resumeEl = [];
    forIn(about.resume, resume => {
      if (this.state.isEditing) {
        resumeEl.push(<div key={resume.id}>
          <label htmlFor={`about__src_resume_input-${resume.id}`}>resume Link</label>
          <input type="text" className="about__src_input" data-id={resume.id} data-type="resume" placeholder={resume.src} defaultValue={resume.src} onChange={this.onAboutSrcChange}/>
          <Dropzone className="about__dropzone" data-id={resume.id} activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
            <button>Upload New File</button>
          </Dropzone>
        </div>);
      }
      else if (resume) {
        resumeEl.push(<a key={resume.id} href={resume.src} target="_blank" className="about__resume_link">{resume.linktext}</a>);
      }
    });
    const aboutImage = [];
    forIn(about.profilepicture, picture => {
      if (this.state.isEditing) {
        aboutImage.push(<div key={picture.id}>
          <label htmlFor={`about__src_input-${picture.id}`}>Picture Link</label><input type="text" data-id={picture.id} data-type="profilepicture" className="about__src_input" placeholder={picture.src} defaultValue={picture.src} onChange={this.onAboutSrcChange}/>
          <Dropzone className="about__dropzone" data-id={picture.id} activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
            <button>Upload New File</button>
          </Dropzone>
        </div>);
      }
      else if (picture) {
        aboutImage.push(<img key={picture.id} className="about__image" src={picture.src}/>);
      }
    });
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="about__container">
            <div className="about__left_col">
              {authenticated && Object.keys(about.content).length > 0 ? <i onClick={this.editAbout} className="fa fa-pencil-square-o page_edit_icon" aria-hidden="true"></i> : null}
              <div className="about__content" data-textedittargetparent>
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
