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
    }
  }
}
`
