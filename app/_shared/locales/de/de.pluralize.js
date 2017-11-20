module.exports = function pluralizeDe(entry, count) {
  // 'one' - 1 day
  if (count === 1) { return entry.one }

  // 'few' - nothing for de
  // 'many' - nothing for de

  // 'other' - 5 days
  return entry.other
}
