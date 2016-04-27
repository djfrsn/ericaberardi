import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class SignIn extends Component {
  static propTypes = {
    containerWidth: PropTypes.number.isRequired
  }
  componentDidMount() {
    // window.addEventListener('resize', () => {
    //   this.setState({
    //     containerWidth: ReactDOM.findDOMNode(this.container).clientWidth
    //   });
    // }, false);
  }

  render() {
    const elements = [
      { src: 'images/home_gallery/photo4.jpg', topText: 'Matt, Ryan & Kyle', bottomText: 'Family, Los Angeles' },
      { src: 'images/home_gallery/photo2.jpg' },
      { src: 'images/home_gallery/photo1.jpg' },
      { src: 'images/home_gallery/photo6.jpg' },
      { src: 'images/home_gallery/photo5.jpg' }
    ];
    return (
      <div className="">
        <div className="gallery-left">
          {
            elements.map((element, index) => {
              const image = index % 2 ? null : (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                </div>
              );
              return image;
            })
          }
        </div>
        <div className="gallery-right">
          {
            elements.map((element, index) => {
              const image = index % 2 ? (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                </div>
              ) : null;
              return image;
            })
          }
        </div>
      </div>
    );
  }
}

// <div className="overlay"><p>{element.topText}</p><span></span><p>{element.bottomText}</p></div>

export default connect(null, authActions)(SignIn);
