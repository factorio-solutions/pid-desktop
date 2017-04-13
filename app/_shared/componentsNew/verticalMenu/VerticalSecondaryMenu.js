import React from 'react'

import SecondaryMenuButton from '../buttons/SecondaryMenuButton'

import styles    from './VerticalSecondaryMenu.scss'


export default function VerticalSecondaryMenu ({ content, selected, onClick })  {

  const prepareMenuButton = (object,index) => {
    const newOnClick = () => {
      onClick()
      object.onClick()
    }
    return <SecondaryMenuButton key={index} label={object.label} onClick={newOnClick} type={object.type} state={object.key===selected && 'selected'}/>
  }

  return (
    <div className={styles.menu}>
      {content.map(prepareMenuButton)}
    </div>
  )
}
