import FileSaver from 'file-saver'

// data is 2D array of values: [
//   ['a', 'b', 'c'],
//   ['a', 'b']
// ]


export function downloadCSV(data) {
  let csvContent = ''

  data.forEach((infoArray, index) => {
    const dataString = infoArray.map(value => (typeof value === 'string' && value.indexOf(',') !== -1 ? '"' + value + '"' : value)).join(',')
    csvContent += index < data.length ? dataString + '\n' : dataString
  })

  const blob = new Blob([ csvContent ], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, 'invoices.csv')
}
