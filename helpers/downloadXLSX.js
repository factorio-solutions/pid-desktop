import FileSaver from 'file-saver'
import XLSX      from 'xlsx'

// data is 2D array of values: [
//   ['a', 'b', 'c'],
//   ['a', 'b']
// ]


function generateXLSX(data) { // in binary
  const workBook = XLSX.utils.book_new()
  workBook.Props = {
    Title:       'Invoices from Park It Direct',
    Subject:     'Invoices',
    Author:      'Park It Direct',
    CreatedDate: new Date()
  }
  const sheetName = 'Park It Direct invoices'
  workBook.SheetNames.push(sheetName)
  const sheet = XLSX.utils.aoa_to_sheet(data) // array of array to sheet function
  workBook.Sheets[sheetName] = sheet
  return XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
}

export function binaryToOctetStream(binary) {
  const buffer = new ArrayBuffer(binary.length)
  const bufferContent = new Uint8Array(buffer) // cannot manipulate buffer directly
  for (let i = 0; i < binary.length; i++) {
    bufferContent[i] = binary.charCodeAt(i) & 0xFF // codeof char, max at 255
  }
  return buffer
}

export function downloadXLSX(data) {
  const binary = generateXLSX(data)
  const octetStream = binaryToOctetStream(binary)
  const blob = new Blob([ octetStream ], { type: 'application/octet-stream' })
  FileSaver.saveAs(blob, 'invoices.xlsx')
}
