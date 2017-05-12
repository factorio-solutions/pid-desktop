// get all reservations
export const GET_RESERVATIONS_QUERY = `{
  reservations {
    id
    invoice_item{
      id
      invoice{
        id
        payed
      }
    }
    client {
      name
    }
    created_at
    creator {
      full_name
      email
    }
    user {
      full_name
      email
      phone
    }
    place {
      label
      floor {
        label
        garage {
          name
          id
        }
      }
    }
    car{
      licence_plate
    }
    begins_at
    ends_at
    approved
    payment_url
    created_at
    updated_at
  }
}
`

// destroy reservation
export const DESTROY_RESERVATION = `mutation reservationMuation($id: Id!) {
  destroy_reservation(id: $id) {
    id
  }
}
`

// check reservations token validity
export const CHECK_VALIDITY = `mutation PaypalPayReservation ($token:String) {
	paypal_check_validity(token: $token)
}`

// check reservations token validity
export const CREATE_CSOB_PAYMENT = `mutation CsobPayReservation ($id: Id!, $url: String) {
	csob_pay_reservation(id: $id, url: $url)
}`
