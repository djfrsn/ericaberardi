import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class About extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="pricing__container">
            <ul className="pricing__link_wrapper">
              <li className="pricing_link_li"><a href="" className="pricing__link">Personal and Family Portraits</a></li>
              <li className="pricing_link_li"><a href="" className="pricing__link">Events(Sports, Birthdays, Showers)</a></li>
              <li className="pricing_link_li"><a href="" className="pricing__link">Commercial</a></li>
            </ul>
            <div className="pricing__packages_wrapper">
              <div className="pricing__package">
                <ul className="pricing__list">
                  <li>Package A</li>
                  <li>$175</li>
                  <li>20 minute session</li>
                  <li>Proofs of 10-15 images</li>
                  <li>Choose 5 images</li>
                  <li>5 jpegs formatted for print and digital use</li>
                  <li>Each additional jpeg for $30</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(About);
// [ Under Construction ]
