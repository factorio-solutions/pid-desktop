export const GET_BILLING_ADDRESS = `query GetGarageBillingAddress($id: Id!) {
  garage(id: $id) {
    account {
      name
      ic
      dic
      address {
        line_1
        line_2
        city
        postal_code
        state
        country
      }
    }
  }
}

`