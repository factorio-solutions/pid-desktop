import React, { Component } from 'react'


export default class TestingPage extends Component {
  componentDidMount() {
    // const data = {
    //   query: `mutation CreateReservation($reservation: ApiReservationInput!) {
    //     create_reservation(reservation: $reservation) {
    //       id
    //     }
    //   }
    //   `,
    //   variables: {
    //     reservation: {
    //       begins_at: '28.02.2018 20:45 +0100',
    //       ends_at:   '28.02.2018 21:15 +0100',
    //       // place_id:  2,
    //       // currency_id: '',
    //       // price:       '',
    //       // note:        '',
    //       user:      {
    //         full_name: 'Some',
    //         email:     'someUser@gmail.com'
    //         // phone:     'Some',
    //       },
    //       car: {
    //         color:         'Black',
    //         licence_plate: '1A2 1234'
    //         // model:         'Tesla model S',
    //         // lpg:           false,
    //         // length:        5,
    //         // height:        1.5,
    //         // width:         2
    //       }
    //     }
    //   }
    // }
    // const data = {
    //   query: `mutation UpdateReservation($id: Id!, $reservation: ApiReservationInput!) {
    //     update_reservation(id: $id, reservation: $reservation) {
    //       id
    //     }
    //   }
    //   `,
    //   variables: {
    //     id:          593,
    //     reservation: {
    //       begins_at: '28.02.2018 20:45 +0100',
    //       ends_at:   '28.02.2018 21:15 +0100',
    //       // place_id:  2,
    //       // currency_id: '',
    //       // price:       '',
    //       // note:        '',
    //       user:      {
    //         full_name: 'Karolina Mamasita',
    //         email:     'someUser@gmail.com'
    //         // phone:     'Some',
    //       },
    //       car: {
    //         color:         'Black',
    //         licence_plate: '1A2 4321'
    //         // model:         'Tesla model S',
    //         // lpg:           false,
    //         // length:        5,
    //         // height:        1.5,
    //         // width:         2
    //       }
    //     }
    //   }
    // }
    // const data = {
    //   query: `mutation RemoveReservation($id: Id!) {
    //     destroy_reservation(id: $id) {
    //       id
    //     }
    //   }
    //   `,
    //   variables: {
    //     id: 586
    //   }
    // }
    // const data = {
    //   query: `query {
    //     reservations {
    //       place {
    //         id
    //       }
    //     }
    //   }
    //   `,
    //   variables: {
    //   }
    // }
    const data = {
      query: `query ($begins_at: Datetime!, $ends_at: Datetime!) {
        garage {
          created_at
          dic
          floors {
            garage {
              id
            }
            label
            scheme
            free_places(begins_at: $begins_at, ends_at: $ends_at) {
              id
            }
            places {
              id
              floor{
                label
              }
              gates{
                label
              }
              height
              id
              label
              length
              pricing{
                currency{
                  code
                }
                exponential_12h_price
                exponential_day_price
                exponential_month_price
                exponential_week_price
                flat_price
                weekend_price
                place{
                  id
                }
              }
              reservations{
                approved
                begins_at
                car{
                  color
                  height
                  length
                  licence_plate
                  lpg
                  model
                  name
                  width
                }
                car_id
                client{
                  address{
                    city
                    country
                    lat
                    line_1
                    line_2
                  }
                  dic
                  ic
                  name
                }
                created_at
                creator{
                  email
                  full_name
                  id
                  language
                  phone
                  reservations{
                    id
                  }
                }
                currency{
                  code
                }
                ends_at
                id
                note
                place{
                  id
                  floor{
                    label
                    garage{
                      name
                    }
                  }
                }
                price
                reservation_case
                user{
                  full_name
                }
              }
            }
          }
          gates {
            address {
              line_1
            }
          }
          height
          ic
          id
          img
          length
          lpg
          name
          places {
            label
          }
          vat
          weight
          width
        }
        currencies {
          code
          name
          symbol
        }
        floors {
          free_places(begins_at: $begins_at, ends_at: $ends_at) {
            id
          }
          places {
            id
          }
        }
      }
      `,
      variables: {
        begins_at: '1.03.2018 20:45 +0100',
        ends_at:   '1.03.2018 21:15 +0100'
      }
    }
    // const data = {
    //   query: `query {
    //     reservations {
    //       place {
    //         id
    //       }
    //     }
    //   }
    //   `,
    //   variables: {
    //   }
    // }

    fetch('http://localhost:3000/api/queries', {
      headers: {
        Authorization:  'NMjYVic6aYh037YmcxYgkN0orWfCkgiAfzeH6iOV',
        'Content-type': 'application/json'
      },
      method: 'POST',
      body:   JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => console.log(response.data))
  }

  render() {
    return (
      <div>
        <h1>Testing page</h1>
      </div>
    )
  }
}
