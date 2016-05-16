import React, { Component } from 'react';
import { connect } from 'react-redux';
import { lightboxActions } from 'core/lightbox';

export default class Lightbox extends Component {
  render() {
    return (
      <div className="gallery-lightbox">
      </div>
    );
  }
}


export default connect(state => ({
  lightbox: state.lightbox
}), Object.assign({}, lightboxActions))(Lightbox);