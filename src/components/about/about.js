import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { aboutActions } from 'core/about';
import { textEditCanvas } from 'helpers/textEdit';
import content from './content';
import forIn from 'lodash.forin';
import Dropzone from 'react-dropzone';
import parseAbout from './parseAbout';

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
      this.props.onDropAccept(files, this); // eslint-disable-line react/prop-types
    } // this.props here is actually equal to props for Dropzone component
  }
  onDropAccept = (files, scope) => {
    var dataType = scope.props['data-type'];
    this.setState({
      ...this.state,
      [dataType]: {
        ...this.state[dataType],
        [`${dataType}-file-${scope.props['data-id']}`]: files[0]
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
      const resumesrc = resume.pendingsrc ? resume.pendingsrc : resume.src;
      if (this.state.isEditing) {
        resumeEl.push(<div key={resume.id}>
          <label htmlFor={`about__src_resume_input-${resume.id}`}>Resume Link</label>
          <input type="text" className="about__src_input" data-id={resume.id} data-type="resume" placeholder={resumesrc} defaultValue={resumesrc} onChange={this.onAboutSrcChange}/>
          <Dropzone className="about__dropzone" data-id={resume.id} data-type="resume" activeClassName="active" accept="image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, text/plain" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
            <button>Upload New File</button>
          </Dropzone>
        </div>);
      }
      else if (resume) {
        resumeEl.push(<a key={resume.id} href={resumesrc} target="_blank" className="about__resume_link">{resume.linktext}</a>);
      }
    });
    const aboutImage = [];
    forIn(about.profilepicture, picture => {
      const picturesrc = picture.pendingsrc ? picture.pendingsrc : picture.src;
      if (this.state.isEditing) {
        aboutImage.push(<div key={picture.id}>
          <label htmlFor={`about__src_input-${picture.id}`}>Picture Link</label><input type="text" data-id={picture.id} data-type="profilepicture" className="about__src_input" placeholder={picturesrc} defaultValue={picturesrc} onChange={this.onAboutSrcChange}/>
          <Dropzone className="about__dropzone" data-id={picture.id} data-type="profilepicture" activeClassName="active" accept="image/jpeg, image/png" onDropAccept={this.onDropAccept} onDrop={this.onDrop}>
            <button>Upload New File</button>
          </Dropzone>
        </div>);
      }
      else if (picture) {
        aboutImage.push(<img key={picture.id} className="about__image" src={picturesrc}/>);
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
