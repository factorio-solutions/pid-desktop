import React, { Component, PropTypes } from 'react'

import requestPromise from '../_shared/helpers/requestPromise'


export default class TestingPage extends Component {
  componentDidMount() {
    requestPromise(`
      query Reservations($user_id: Id, $garage_id: Id, $past: Boolean, $ongoing: Boolean, $count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash, $find_by_id: Id) {
        reservations_metadata(user_id: $user_id, garage_id: $garage_id, past: $past, ongoing: $ongoing, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search, find_by_id: $find_by_id) {
          count
          page
        }
        reservations(user_id: $user_id, garage_id: $garage_id, past: $past, ongoing: $ongoing, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search, find_by_id: $find_by_id) {
          history{
            note
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
              is_secretary
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
                  flexiplace
                  id
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
          invoice_item {
            id
            invoice {
              id
              payed
            }
          }
          client {
            name
            is_secretary
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
                flexiplace
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
      `,
      { past: false, ongoing: true, user_id: 2628, order_by: "begins_at" }
    )
    .then(data => console.log(data))
  }

  render() {
    return (
      <div>
        <h1>Testing page</h1>
      </div>
    )
  }
}
