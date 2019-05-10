import React from 'react'
import PropTypes from 'prop-types'

import MenuButton from '../buttons/MenuButton'

const VerticalMenu = ({ content, onClick, verticalSelected }) => {
  const prepareMenuButton = (object, index) => {
    const newOnClick = () => {
      onClick && onClick()
      object.onClick()
    }

    return (
      <MenuButton
        key={`${index}_${object.label}`}
        icon={object.icon}
        label={object.label}
        onClick={newOnClick}
        type={object.type}
        state={verticalSelected === object.key ? 'selected' : undefined}
      />
    )
  }

  return (
    <React.Fragment>
      {content.map(prepareMenuButton)}
    </React.Fragment>
  )
}

VerticalMenu.propTypes = {
  content:          PropTypes.object,
  verticalSelected: PropTypes.string,
  onClick:          PropTypes.func
}

export default VerticalMenu
