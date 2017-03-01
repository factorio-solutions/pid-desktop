// get all reservations
<<<<<<< HEAD
export const GET_RESERVATIONS_QUERY = '{reservations{id, account{ name }, created_at, creator{ full_name, email }, user{ full_name }, place { label, floor{ label, garage{ name, id} } }, begins_at, ends_at}}'

// destroy reservation
export const DESTROY_RESERVATION = 'mutation reservationMuation ($id: Id!){ destroy_reservation (id: $id){ id } }'
=======
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
    begins_at
    ends_at
    approved
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
>>>>>>> feature/new_api
