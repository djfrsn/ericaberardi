import React from 'react';

export default opts => {
  return (
    <div key={opts.index} id={opts.element.id} className="image__container" >
      <img src={opts.src} />
      <div className="overlay"><div className="overlay__content" id={opts.element.id} data-gallery="homeGalleryOne">
        {opts.elUrlInput}
        {opts.elEditIcon}
        {opts.elImageText}
      </div></div>
    </div>
  );
};
