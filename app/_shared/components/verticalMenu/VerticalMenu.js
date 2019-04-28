import React from 'react'
import PropTypes from 'prop-types'

import MenuButton from '../buttons/MenuButton'

const VerticalMenu = ({ content, url, onClick }) => {
  const prepareMenuButton = (object, index) => {
    const newOnClick = () => {
      onClick()
      object.onClick()
    }

    return <MenuButton key={`${index}_${object.label}`} icon={object.icon} label={object.label} onClick={newOnClick} type={object.type} state={url.includes(object.key) && 'selected'} />
  }

  return (
    <React.Fragment>
      {content.map(prepareMenuButton)}
    </React.Fragment>
  )
}

VerticalMenu.propTypes = {
  content: PropTypes.object,
  url:     PropTypes.string,
  onClick: PropTypes.func
}

export default VerticalMenu
