import React, { Component } from 'react'


export default class TestingPage extends Component {
  componentDidMount() {
    const data = {
      query: `query ReservationsQuery {
        reservations {
          id
        }
      }
      `,
      variables: {
        garage_id: 1
      }
    }

    fetch('http://localhost:3000/api/queries', {
      headers: {
        Authorization:  'NMjYVic6aYh037YmcxYgkN0orWfCkgiAfzeH6iOV',
        'Content-type': 'application/json'
      },
      method: 'POST',
      body:   JSON.stringify(data)
    })
    .then(response => console.log(response))
  }

  render() {
    return (
      <div>
        <h1>Testing page</h1>
      </div>
    )
  }
}
