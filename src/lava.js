/*
* General
*/

// IMPROVEMENT: this function should take a param for what index of a url you would like
// no matter how long i.e val = '1/2/3'; parsePath(val, 3) === 3 // true
export function parsePath(val) { // takes paths like galleries/sports || /galleries/sports and returns sports
  let path = '/';
  const pathSplit = val.split('/');
  const length = pathSplit.length;

  if (length === 2 || length === 3) {
    path = pathSplit[length - 1];
  }

  return {
    path
  };
}
