import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';

export class About extends Component {
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="about__container">
            <div className="about__left_col">
              <div className="about__content">
                <p className="about__content__p">Erica believes in the beauty of life as it happens in every day moments.</p>
                <p className="about__content__p">Born and raised in St. Louis, Mo., Erica lived in New York, New York for over a decade. She is a mother of two boys and now lives in the South Bay area of Los Angeles, Calif.</p>
                <p className="about__content__p">Erica holds a bachelors of political science and a bachelors of journalism from top-ranked University of Missouri - Columbia, School of Journalism. She also earned her masters degree in arts and humanities from New York University's Steinhardt School of Culture, Education and Human Development.</p>
                <p className="about__content__p">The Wall Street Journal, Dow Jones Newswires and Women's Wear Daily, among others, have published Erica's news stories, which primarily focus on the business of Fortune 500, publically-traded companies.</p>
              </div>
            </div>
            <div className="about__right_col">
              <img className="about__image" src="https://static.wixstatic.com/media/15a929_bd20dfe9e7be4017a6cdf8cd159bb9f0.jpg/v1/fill/w_335,h_518,al_c,q_80,usm_0.66_1.00_0.01/15a929_bd20dfe9e7be4017a6cdf8cd159bb9f0.jpg" alt=""/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(About);
