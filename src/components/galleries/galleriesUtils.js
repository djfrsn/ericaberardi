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
