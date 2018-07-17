// fetch invoices
export const GET_INVOICES = `query Query($past: Boolean!, $garage_id: Id) {
  invoices (past:$past, garage_id:$garage_id){
    id
    invoice_number
    longterm_rent
    invoice_date
    due_date
    payed
    ammount
    subject
    canceled
    is_storno_invoice
    vat
    currency{
      symbol
    }
    account{
      garage{
        name
        id
        is_admin
      }
    }
    client{
      client_user{
        admin
        secretary
      }
      name
      id
      admins{
        id
      }
    }
  }
}
`

export const GET_USERS_INVOICES = `query {
  users_invoices{
    id
    invoice_number
    longterm_rent
    invoice_date
    due_date
    payed
    ammount
    subject
    canceled
    is_storno_invoice
    vat
    currency{
      symbol
    }
    account{
      garage{
        name
        id
        is_admin
      }
    }
    user{
      full_name
    }
  }
}
`
// Get account details
// export const GET_ACCOUNT_DETAILS = `query GetAccountDetails ($id: Id!) {
//   accounts(id:$id){
//     id
//     name
//   }
// }
// `

// Get client details
// export const GET_CLIENT_DETAILS = `query GetClientDetails ($id: Id!) {
//   client(id:$id){
//     id
//     name
//   }
// }
// `

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
