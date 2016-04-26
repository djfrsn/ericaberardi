import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class SignIn extends Component {
  // static propTypes = {
  //   signInWithGithub: PropTypes.func.isRequired,
  //   signInWithGoogle: PropTypes.func.isRequired,
  //   signInWithTwitter: PropTypes.func.isRequired
  // };

  render() {
    // const {
    //   signInWithGithub,
    //   signInWithGoogle,
    //   signInWithTwitter
    // } = this.props;
    const elements = [
      { src: 'images/home_gallery/photo1.jpg' },
      { src: 'images/home_gallery/photo2.jpg' },
      { src: 'images/home_gallery/photo3.jpg' },
      { src: 'images/home_gallery/photo4.jpg' },
      { src: 'images/home_gallery/photo5.jpg' },
      { src: 'images/home_gallery/photo6.jpg' }
    ];
    const childElements = elements.map(function(element, i) {
      return (
        <img key={i} src={element.src} />
      );
    });
    return (
      <div className="">
        <div className="masonry">
          {childElements}
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(SignIn);
