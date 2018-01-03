module.exports = function pluralizeCs(entry, count) {
  // pocet je 1
  if (count === 1) { return entry.one }

  // pocet je 2, 3 nebo 4
  if ([ 2, 3, 4 ].includes(count)) { return entry.few }

  // ma desetinne misto
  if (count % 1 !== 0) { return entry.many }

  return entry.other
}
