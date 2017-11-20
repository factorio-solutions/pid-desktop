import React from 'react'

import MenuButton from '../buttons/MenuButton'

import style    from './VerticalMenu.scss'


export default function VerticalMenu ({ content, selected, onClick })  {

  const prepareMenuButton = (object,index) => {
    const newOnClick = () => {
      onClick()
      object.onClick()
    }
    return <MenuButton key={index} icon={object.icon} label={object.label} onClick={newOnClick} type={object.type} state={object.key===selected && 'selected'}/>
  }

  return (
    <div>
      {content.map(prepareMenuButton)}
    </div>
  )
}
