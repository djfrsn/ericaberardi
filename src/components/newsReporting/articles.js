import React from 'react';
import Dropzone from 'react-dropzone';
import forIn from 'lodash.forin';

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
          {!scope.state.isEditing ? <a href={src} target="_blank" className="article__link">Read Full Story</a> : null}
          {authenticated && scope.state.isEditing ? <div><label htmlFor={`article__src_input-${id}`}>Article Link</label><input type="text" id={`article__src_input-${id}`} className="article__src_input" placeholder={src} data-articleid={id} defaultValue={src} onChange={scope.onArticleSrcChange}/></div> : null}
          {authenticated && scope.state.isEditing ? <Dropzone id={id} className="articles__dropzone doc_file" activeClassName="active" accept="image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, text/plain, application/zip, application/x-compressed-zip" onDropAccept={scope.onDropAccept} onDrop={scope.onDrop}>
            <button>Upload New File</button>
          </Dropzone> : null}
        </div>
      );
    }
  });
  return elements;
};
