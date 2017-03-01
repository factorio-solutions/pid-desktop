import React        from 'react'
<<<<<<< HEAD
import styles       from './Card.scss'
=======
>>>>>>> feature/new_api
import moment       from 'moment'

import Card         from './Card'
import RoundButton  from '../buttons/RoundButton'

import { t }       from '../../modules/localization/localization'

<<<<<<< HEAD

// onClick and selected are expected to be set by CardViewLayout
export default function GarageCard ({ garage, occupancy, edit, account, state, onClick, selected })  {

  const footer = <div className={styles.footerContainer}>
            <span className={styles.footerInfo}>
              {t(['garages','created'])} {moment(garage.created_at).format('ddd DD.MM.YYYY HH:mm')}
            </span>
            <span className={styles.buttons}>
              <RoundButton content={<span className='fa fa-eye' aria-hidden="true"></span>} onClick={occupancy} type='action'/>
              <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={edit} type='action'/>
              <RoundButton content={<span className='fa fa-users' aria-hidden="true"></span>} onClick={account} type='action'/>
            </span>
          </div>
=======
import styles       from './Card.scss'


// onClick and selected are expected to be set by CardViewLayout
export default function GarageCard ({ garage, occupancy, edit, client, gates, users, marketing, state, onClick, selected })  {

  const footer =  <div>
                    <div>
                      {t(['garages','created'])} {moment(garage.created_at).format('ddd DD.MM.YYYY HH:mm')}
                    </div>
                    <div>
                      <RoundButton content={<span className='fa fa-eye' aria-hidden="true"></span>}    onClick={()=>{occupancy()}} type='action' />
                      <RoundButton content={<span className='fa fa-rocket' aria-hidden="true"></span>} onClick={()=>{marketing()}} type='action' state={!garage.admin  && 'disabled'}/>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={()=>{edit()}}      type='action' state={!garage.admin  && 'disabled'}/>
                      <RoundButton content={<span className='fa fa-users' aria-hidden="true"></span>}  onClick={()=>{client()}}    type='action' state={!garage.admin  && 'disabled'}/>
                      <RoundButton content={<span className='fa fa-cog' aria-hidden="true"></span>}    onClick={()=>{gates()}}     type='action' state={!garage.admin  && 'disabled'}/>
                      <RoundButton content={<span className='fa fa-child' aria-hidden="true"></span>}  onClick={()=>{users()}}     type='action' />

                    </div>
                  </div>

  const address = <div>
                    <div>{garage.address.line_1}</div>
                    {garage.address.line_2 && <div>{garage.address.line_2}</div>}
                    <div>{garage.address.city}</div>
                    <div>{garage.address.postal_code}</div>
                    {garage.address.state && <div>{garage.address.state}</div>}
                    <div>{garage.address.coutry}</div>
                  </div>
>>>>>>> feature/new_api

  return (
    <Card
      header = {<strong>{garage.name}</strong>}
<<<<<<< HEAD
      body = {garage.address || '\u00A0'}
=======
      body = {garage.address ? address : '\u00A0'}
>>>>>>> feature/new_api
      footer = {footer}
      state = {state}

      onClick = {onClick}
      selected ={selected}
    />
  )
}
