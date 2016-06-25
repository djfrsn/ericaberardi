import forIn from 'lodash.forin';
import findIndex from 'lodash.findindex';
/*
* Lava: utils for building apps with firebase services
*/

/*
* General
*/

// TODO: this function should take a param for what index of a url you would like
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

/*
* Database
*/

// Helpful for converting objects and their list of key values into an object array
export function fObjectToObjectArray(fObject) {
  let objectArray = {};
  forIn(fObject, (value, key) => {
    let newKey = objectArray[key] = []; // create array for fObject key
    forIn(value, (val, key) => {
      val.fObjectKey = key; // allow child objects to be referenced by key
      newKey.push(val); // push objects into fObject key
    });
  });
  // input
  // { commercial: { foo: { foo: bar }, bar: { foo: bar } } }
  // output
  // { commercial: [{ foo: bar }, { foo: bar }] }
  return objectArray;
}

// Helpful for merging ObjectArrays
export function mergeObjectArrays(destination, source) {
  let mergedObjectArray = {};
  forIn(destination, (list, key) => {
    let newKey = mergedObjectArray[key] = []; // create key for mergedObjectArray
    newKey.push(...list); // push list of key/val pairs onto array
    if (source[key]) { // check if source[key] existing ....
      forIn(source[key], val => {
        const isNewVal = findIndex(newKey, { id: val.id }) === -1; // returns true if val isn't found in newKey
        if (isNewVal) {
          newKey.push(val); // push matched source object children into newKey
        }
      });
    }
  });
  // input
  // destination: { commercial: [{ foo: bar }, { foo: bar }], sports: [{ foo: bar }, { foo: bar }] }
  // source: { commercial: [{ foo: bar }], portraits: [{ foo: bar }, { foo: bar }] }
  // output
  // { commercial: [{ foo: bar }, { foo: bar }, { foo: bar }], sports: [{ foo: bar }, { foo: bar }], portraits: [{ foo: bar }, { foo: bar }] }
  return mergedObjectArray;
}
