export default {
  uuid: function() {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)) // eslint-disable-line no-nested-ternary
        .toString(16);
    }

    return uuid;
  },

  store: function(namespace, data) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  },
  randomInt: function( min, max ) {
    return Math.floor( Math.random() * max + min );
  },
  isFunction: function( func ) {
    return typeof func === 'function';
  }
};
