module.exports = function pluralizePl(entry, count) {
  const mod10 = count % 10
  const mod100 = count % 100

  // count is 1
  if (count === 1) { return entry.one }

  // count ends with 2, 3 or 4 but does not end with 11, 12, 13
  if ([ 2, 3, 4 ].includes(mod10) && ![ 12, 13, 14 ].includes(mod100)) { return entry.few }

  // count ends with 0, 1, 5 - 9 or ends with 11, 12, 13
  if ([ 0, 1, 5, 6, 7, 8, 9 ].includes(mod10) || [ 12, 13, 14 ].includes(mod100)) { return entry.many }

  return entry.other
}
