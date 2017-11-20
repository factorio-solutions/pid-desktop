// get all reservations
export const GET_RESERVATIONS_QUERY = `query Reservations($past: Boolean) {
  reservations(past: $past) {
    id
    reservation_case
    invoice_item {
      id
      invoice {
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
      id
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
      gates {
        id
        label
        phone
      }
    }
    car {
      licence_plate
    }
    begins_at
    ends_at
    approved
    payment_url
    created_at
    updated_at

    recurring_reservation{
      id
      relevant_count
    }
  }
}
`

// get all reservations query pagination compatibile
export const GET_RESERVATIONS_PAGINATION_QUERY = `query Reservations($past: Boolean, $count: Int, $page: Int, $order_by: String, $includes: String) {
  reservations(past: $past, count: $count, page: $page, order_by: $order_by, includes: $includes) {
    id
    reservation_case
    invoice_item {
      id
      invoice {
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
      id
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
      gates {
        id
        label
        phone
      }
    }
    car {
      licence_plate
    }
    begins_at
    ends_at
    approved
    payment_url
    created_at
    updated_at
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
