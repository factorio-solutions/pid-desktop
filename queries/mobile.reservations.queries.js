// get all reservations
export const MOBILE_GET_RESERVATIONS_QUERY = `query MobileReservations($count: Int, $page: Int, $order_by: String, $search: String, $garage_id: Id, $user_id: Id, $secretary: Boolean, $no_include_me: Boolean) {
  mobile_reservations(count: $count, page: $page, order_by: $order_by, search: $search, garage_id: $garage_id, user_id: $user_id, secretary: $secretary, no_include_me: $no_include_me) {
    id
    user {
      id
      full_name
    }
    client{
      name
      is_secretary
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
        password
      }
    }
    begins_at
    ends_at
    approved
  }
  mobile_reservations_meta(count: $count, page: $page, order_by: $order_by, search: $search, garage_id: $garage_id, user_id: $user_id, secretary: $secretary) {
    count
    page
  }
}
`
// export const MOBILE_GET_RESERVATIONS_QUERY = `query Reservations($count: Int, $order_by: String) {
//   reservations(count: $count, order_by: $order_by) {
//     id
//     user {
//       id
//       full_name
//     }
//     client{
//       name
//       is_secretary
//     }
//     place {
//       label
//       floor {
//         label
//         garage {
//           name
//           id
//         }
//       }
//       gates {
//         id
//         label
//         phone
//         password
//       }
//     }
//     begins_at
//     ends_at
//     approved
//   }
// }
// `

// opens gate of selected reservation
export const MOBILE_ACCESS_OPEN_GATE = `mutation OpenGate ($user_id:Id!, $reservation_id:Id!, $gate_id:Id!) {
  open_gate(user_id: $user_id, reservation_id: $reservation_id, gate_id: $gate_id)
}
`

export const MOBILE_ACCESS_LOG_ACCESS = `mutation CreateAccessLog($gate_access_log: GateAccessLogInput!) {
  create_gate_access_log(gate_access_log: $gate_access_log) {
    id
  }
}
`
