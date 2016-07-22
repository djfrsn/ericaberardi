import React from 'react';
import Dropzone from 'react-dropzone';
import forIn from 'lodash.forin';

// TODO: add label for article input
export default (articles, scope) => {
  let elements = [];
  forIn(articles, element => {
    if (element) {
      const authenticated = scope.props.auth.authenticated;
      const id = element.id;
      const title = element.pendingtitle ? element.pendingtitle : element.title;
      const publisher = element.pendingpublisher ? element.pendingpublisher : element.publisher;
      const content = element.pendingcontent ? element.pendingcontent : element.content;
      const src = element.pendingsrc ? element.pendingsrc : element.src;
      elements.push(
        <div key={id} className="article" data-textedittargetparent>
          <h2 data-texteditid={`title-${id}`} data-textedittarget>{title}</h2>
          <h4 data-texteditid={`publisher-${id}`} data-textedittarget>{publisher}</h4>
          <p className="article__content" data-texteditid={`content-${id}`} data-textedittarget data-textedittype="textarea">{content}</p>
          <a href={src} target="_blank" className="article__link">Read Full Story</a>
          {authenticated ? <input type="text" className="article__src_input" placeholder={src} ref={ref => scope[`newUrl-${id}`] = ref}/> : null}
          {authenticated ? <Dropzone id={id} className="articles__dropzone doc_file" activeClassName="active" accept="image/jpeg, image/png" onDropAccept={scope.onDropAccept} onDrop={scope.onDrop}>
            <button>Upload New File</button>
          </Dropzone> : null}
        </div>
      );
    }
  });
  return elements;
};
