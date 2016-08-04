import React from 'react';

export default (opts = {}) => {
  const iconsWrapperClass = opts.className ? `${opts.className} contact__social_icons` : 'contact__social_icons';
  return (
    <div className={iconsWrapperClass}>
      <a href="https://www.facebook.com/ericaberardiphotography/" target="_blank" className="contact__social_link"><i className="fa fa-facebook-official" aria-hidden="true"></i></a>
      <a href="#" className="contact__social_link"><i className="fa fa-twitter" aria-hidden="true"></i></a>
      <a href="https://www.instagram.com/ericaberardiphotography/?hl=en" target="_blank" className="contact__social_link"><i className="fa fa-instagram" aria-hidden="true"></i></a>
      <a href="#" className="contact__social_link"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
    </div>
  );
};
