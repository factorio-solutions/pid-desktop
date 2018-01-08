// data is 2D array of values: [
//   ['a', 'b', 'c'],
//   ['a', 'b']
// ]

export function downloadCSV(data) {
  let csvContent = 'data:text/csv;charset=utf-8,\ufeff'
  data.forEach((infoArray, index) => {
    const dataString = infoArray.map(value => (typeof value === 'string' && value.indexOf(',') !== -1 ? '"' + value + '"' : value)).join(',')
    // let dataString = infoArray.join(",")
    csvContent += index < data.length ? dataString + '\n' : dataString
  })

  const encodedUri = encodeURI(csvContent)
  console.log(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'invoices.csv')
  link.click()
}
