module.exports = function pluralizeEn(entry, count) {
  // 'one' - 1 day
  if (count === 1) { return entry.one }

  // 'few' - nothing for english
  // 'many' - nothing for english

  // 'other' - 5 days
  return entry.other
}
