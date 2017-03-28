// fetch invoices
export const GET_INVOICES = `query ($client_id: Id, $account_id: Id, $past: Boolean){
  invoices(client_id: $client_id, account_id: $account_id, past: $past ){
    id
    invoice_date
    due_date
    payed
    ammount
    subject
   	currency{
      symbol
    }
    account{
      name
    }
    client{
      name
      admins{
        id
      }
    }
  }
}
`
// Get account details
export const GET_ACCOUNT_DETAILS = `query GetAccountDetails ($id: Id!) {
  accounts(id:$id){
    id
    name
  }
}
`

// Get client details
export const GET_CLIENT_DETAILS = `query GetClientDetails ($id: Id!) {
  client(id:$id){
    id
    name
  }
}
`

// will update invoice
export const UPDATE_INVOICE = `mutation UpdatInvoice ($id: Id!, $invoice:InvoiceInput!){
  update_invoice(invoice: $invoice, id: $id){
    id
    payment_url
  }
}
`

// notification reminder
export const REMINDER_NOTIFICATION = `mutation CreateNotification ($notification: NotificationInput!){
  create_notification( notification: $notification) {
    id
  }
}
`

export const DOWNLOAD_INVOICE = `download ($id:Id!) {
  download_invoice(id:$id)
}
`

export const PAY_INVOICE = `mutation PaypalPayInvoice ($token:String) {
	paypal_pay_invoice(token: $token) {
		id
    payed
	}
}
`
