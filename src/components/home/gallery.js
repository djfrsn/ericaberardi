import React, { Component, PropTypes } from 'react';
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
      { src: 'images/home_gallery/photo4.jpg', topText: 'Milo', bottomText: 'Portrait, Los Angeles' },
      { src: 'images/home_gallery/photo2.jpg', topText: 'Lara Croft', bottomText: 'Portrait, San Francisco Coast' },
      { src: 'images/home_gallery/photo1.jpg', topText: 'Matt, Ryan & Kyle', bottomText: 'Family, San Diego' },
      { src: 'images/home_gallery/photo6.jpg', topText: 'Sila, Rebecca & Milo', bottomText: 'Family, Los Angeles' },
      { src: 'images/home_gallery/photo5.jpg', topText: 'Laura Vance', bottomText: 'Portrait, Los Angeles' }
    ];
    return (
      <div className="">
        <div className="gallery-left">
          {
            elements.map((element, index) => {
              const image = index % 2 ? null : (
                <div key={index} className="image__container" >
                  <img src={element.src} />
                  <div className="overlay"><div className="overlay__content"><p>{element.topText}</p><span></span><p>{element.bottomText}</p></div></div>
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
                  <div className="overlay"><div className="overlay__content"><p>{element.topText}</p><span></span><p>{element.bottomText}</p></div></div>
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



export default connect(null, authActions)(SignIn);
