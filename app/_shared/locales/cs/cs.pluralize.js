'use strict';

// Specify when to use keys 'one', 'few', 'many', 'other'
// 'one' - 1 den
// 'few' - 2-4 dny
// 'many' - 1,5 dne
// 'other' - 5 dni
module.exports = function(entry, count) {
  if (count == 1) { // pocet je 1
    return entry['one']
  }

  if ([2,3,4].indexOf(count) != -1){ // pocet je 2, 3 nebo 4
    return entry['few']
  }

  if (count % 1 != 0){ // ma desetinne misto
    return entry['many']
  }
  return entry['other']

};
