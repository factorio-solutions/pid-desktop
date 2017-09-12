import React, { Component, PropTypes } from 'react'
import { get }                     from '../_shared/helpers/get'
import { request } from '../_shared/helpers/request'

export default class TestingPage extends Component {

    render() {
      const downloadPricings = () => {
        const onSuccess = (response) => {
          console.log(response);
        }

        request(onSuccess, `query Query{
          invoices (past: true, garage_id: 4){
            id
            invoice_number
            longterm_rent
            invoice_date
            due_date
            payed
            ammount
            subject
            canceled
            is_storno_invoice
            vat
           	currency{
              symbol
            }
            account{
              garage{
                name
                id
                is_admin
              }
            }
            client{
              is_admin
              is_secretary
              name
              id
              admins{
                id
              }
            }
          }
        }`)
      }

    return (
      <div>
        <h1>Testing page</h1>
        <img src={'https://s3-eu-west-1.amazonaws.com/park-it-direct-alpha/floors/Strazni.svg'} />
        <button onClick={downloadPricings}>GET</button>
      </div>
    );
  }
}
