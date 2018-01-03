// download invoice details
export const DOWNLOAD_INVOICE = `query Query($id: Id!) {
  invoice (id:$id){
    id
    ammount
    vat
    subject
    invoice_date
    due_date
    invoice_number
  }
}
`

// generate new invoice based on current information
export const REGENERATE_INVOICE = `mutation CreateInvoice($invoice: InvoiceInput!, $id: Id!) {
  create_invoice(invoice:$invoice, id:$id){
    id
  }
}
`
