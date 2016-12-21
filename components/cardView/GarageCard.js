import React        from 'react'
import moment       from 'moment'

import Card         from './Card'
import RoundButton  from '../buttons/RoundButton'

import { t }       from '../../modules/localization/localization'

import styles       from './Card.scss'


// onClick and selected are expected to be set by CardViewLayout
export default function GarageCard ({ garage, occupancy, edit, account, marketing, state, onClick, selected })  {

  const footer =  <div className={styles.footerContainer}>
                    <span className={styles.footerInfo}>
                      {t(['garages','created'])} {moment(garage.created_at).format('ddd DD.MM.YYYY HH:mm')}
                    </span>
                    <span className={styles.buttons}>
                      <RoundButton content={<span className='fa fa-eye' aria-hidden="true"></span>} onClick={occupancy} type='action'/>
                      <RoundButton content={<span className='fa fa-pencil' aria-hidden="true"></span>} onClick={edit} type='action'/>
                      <RoundButton content={<span className='fa fa-users' aria-hidden="true"></span>} onClick={account} type='action'/>
                      <RoundButton content={<span className='fa fa-rocket' aria-hidden="true"></span>} onClick={marketing} type='action'/>
                    </span>
                  </div>

  return (
    <Card
      header = {<strong>{garage.name}</strong>}
      body = {garage.address || '\u00A0'}
      footer = {footer}
      state = {state}

      onClick = {onClick}
      selected ={selected}
    />
  )
}
