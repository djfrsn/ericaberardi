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
      { src: 'images/home_gallery/photo1.jpg', topText: 'Matt, Ryan & Kyle', bottomText: 'Family, Los Angeles' },
      { src: 'images/home_gallery/photo2.jpg' },
      { src: 'images/home_gallery/photo3.jpg' },
      { src: 'images/home_gallery/photo4.jpg' },
      { src: 'images/home_gallery/photo5.jpg' },
      { src: 'images/home_gallery/photo6.jpg' }
    ];
    return (
      <div className="">
        <div className="masonry">
          {
            elements.map((element, index) => {
              let style = {
                width: index % 2 === 0 ? 190 : 390,
                height: index % 2 === 0 ? 175 : 370
              };
              return (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><p>{element.topText}</p><span></span><p>{element.bottomText}</p></div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(SignIn);
