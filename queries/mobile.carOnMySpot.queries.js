// will shift reservation place
export const SHIFT_RESERVATION_PLACE = `mutation ShiftReservationPlace($id: Id!, $licence_plate: String) {
  shift_reservation_place(id: $id, licence_plate: $licence_plate) {
    begins_at
    place {
      id
      label
      floor {
        label
        garage {
          name
          id
          security{
            full_name
            phone
            email
          }
        }
      }
      gates {
        id
        label
        phone
        password
      }
    }
    client {
      contact_persons {
        full_name
        phone
        email
      }
    }
  }
}
`
