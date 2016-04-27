import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import Gallery from './gallery';

export class Home extends Component {
  static propTypes = {
    signInWithGithub: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
    signInWithTwitter: PropTypes.func.isRequired
  };
  constructor() {
    super();
    this.state = { containerWidth: 0 };
  }

  componentDidMount() {
    this.setState({ containerWidth: ReactDOM.findDOMNode(this.row).clientWidth});
  }

  render() {
    return (
      <div className="g-row" ref={ref => this.row = ref}>
        <div className="g-col" >
          <Gallery containerWidth={this.state.containerWidth}/>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(Home);
