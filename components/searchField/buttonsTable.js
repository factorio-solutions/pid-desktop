import PropTypes from 'prop-types'
import React from 'react'
import ButtonsTableRow from './buttonsTableRow'

const ButtonsTable = ({ buttons, className, ...props }) => {
  return (
    <table className={className}>
      <tbody>
        {buttons.map(button => (
          <ButtonsTableRow
            button={button}
            {...props}
          />
        ))}
      </tbody>
    </table>
  )
}

ButtonsTable.propTypes = {
  buttons:   PropTypes.array.isRequired,
  className: PropTypes.string
}

export default ButtonsTable
