import React, { Component } from 'react'


export default class TestingPage extends Component {
  componentDidMount() {
    const data = {
      query: `query ReservationsQuery ($garage_id: Id){
        reservations(garage_id: $garage_id){
          id
        }
      }`,
      variables: {
        garage_id: 1
      }
    }

    fetch('http://localhost:3000/api', {
      method:  'POST',
      headers: { Authorization: 'u4bymM0nNzXCJ078RpLYPTTX488H0nVfau4C24sS' },
      body:    JSON.stringify(data)
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
