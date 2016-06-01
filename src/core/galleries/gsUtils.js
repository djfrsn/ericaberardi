export function activeGalleries(state) {
  const pendingGalleries = state['pending-galleries'];
  const hasPendingGalleries = Object.keys(pendingGalleries).length > 0;
  const galleriesKey = hasPendingGalleries ? 'pending-galleries' : 'galleries';
  const galleries = hasPendingGalleries ? pendingGalleries : state.galleries.galleries;

  return { galleries, galleriesKey };
}
