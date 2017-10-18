'use strict';

// Specify when to use keys 'one', 'few', 'many', 'other'
// 'one' - 1 day
// 'few' - nothing for english
// 'many' - nothing for english
// 'other' - 5 days
module.exports = function(entry, count) {
  if (count == 1) {
    return entry['one']
  }

  return entry['other']
};
