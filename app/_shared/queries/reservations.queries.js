// get all reservations query pagination compatibile
export const GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY = `query Reservations($user_id: Id, $garage_id: Id, $past: Boolean, $ongoing: Boolean, $count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash, $find_by_id: Id) {
  reservations_metadata(with_deleted: true, user_id: $user_id, garage_id: $garage_id, past: $past, ongoing: $ongoing, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search, find_by_id: $find_by_id) {
    count
    page
  }
  reservations(with_deleted: true, user_id: $user_id, garage_id: $garage_id, past: $past, ongoing: $ongoing, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search, find_by_id: $find_by_id) {
    record_updates{
      created_at
      user{
        email
      }
    }
    history{
      note
      reservation_case
      client {
        name
        is_secretary
        is_internal
      }
      user {
        id
        full_name
        email
      }
      place {
        label
        floor {
          label
          garage {
            name
            flexiplace
            id
            dic
            vat
          }
        }
      }
      car {
        licence_plate
      }
      begins_at
      ends_at
      approved
    }
    id
    note
    reservation_case
    invoices {
      id
      invoice_number
      payed
    }
    client {
      name
      is_secretary
      is_internal
    }
    user {
      id
      full_name
      email
    }
    creator{
      email
    }
    place {
      label
      floor {
        label
        garage {
          name
          flexiplace
          id
          dic
          vat
        }
      }
    }
    car {
      licence_plate
    }
    begins_at
    ends_at
    approved
    created_at
    payment_url
    price
    deleted_at
    currency{
      symbol
    }
    recurring_reservation {
      id
      relevant_count
    }
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

// will take recurring reservation and will destroy their
export const DESTROY_RECURRING_RESERVATIONS = `mutation reservationMuation($id: Id!) {
  destroy_recurring_reservation(id: $id) {
    id
  }
}
`
