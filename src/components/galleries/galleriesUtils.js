export function parsePath(val) {
  let path = '/';
  const pathSplit = val.split('/');
  if (pathSplit.length === 3) {
    path = pathSplit[2];
  }

  return {
    path
  };
}
export function setGallery(props, scope) {
  const { pathname } = props.location;
  const path = parsePath(pathname).path;
  const defaultGallery = 'commercial';
  const galleryPath = path === '/' ? defaultGallery : path;
  const galleries = props.galleries.galleries;
  const gallery = props.galleries.galleries[galleryPath] || {};
  const categories = Object.keys(galleries);

  if (categories.length > 0) {
    scope.setState({ categories, gallery });
  }
}
