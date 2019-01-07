import React, { PropTypes } from 'react'

import CallToActionButton from '../buttons/CallToActionButton'

import { t } from '../../modules/localization/localization'

const getTypeOfUser = user => {
  if (user.id === -1) {
    if (user.rights && user.rights.internal) {
      return 'newInternal'
    } else {
      return 'newHost'
    }
  } else {
    return 'onetimeVisit'
  }
}

const ButtonsTableRow = ({ button, onClick }) => {
  const typeOfUser = getTypeOfUser(button)
  const label = (<b>{button.full_name}</b>)

  return (
    <tr>
      <td>
        <CallToActionButton
          label={(<b>{label}</b>)}
          onMouseDown={() => onClick(button.id, button.rights)}
        />
      </td>
      <td>{
        [ label, ' ', t([ 'newReservation', `${typeOfUser}Text` ]) ]
      }</td>
    </tr>
  )
}


ButtonsTableRow.propTypes = {
  button:  PropTypes.object.isRequired,
  onClick: PropTypes.func
}

export default ButtonsTableRow
