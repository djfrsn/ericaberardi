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
                <a href="https://firebasestorage.googleapis.com/v0/b/erica-berardi.appspot.com/o/resume%2FErica_Berardi_Resume_2016.docx?alt=media&token=2c0da417-c212-4dbf-a8f6-57d869592ad2" target="_blank" className="about__resume_link">See Erica's resume!</a>
              </div>
            </div>
            <div className="about__right_col">
              <img className="about__image" src="https://firebasestorage.googleapis.com/v0/b/erica-berardi.appspot.com/o/resume%2Ferica.jpg?alt=media&token=cf200d77-4d0f-4489-8169-f34522e091ac" alt=""/>
            </div>
          </div>
          <div className="contact__social_icons about">
            <a href="#" className="contact__social_link"><i className="fa fa-facebook-official" aria-hidden="true"></i></a>
            <a href="#" className="contact__social_link"><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#" className="contact__social_link"><i className="fa fa-instagram" aria-hidden="true"></i></a>
            <a href="#" className="contact__social_link"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, authActions)(About);
