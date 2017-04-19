import React from 'react'

import SecondaryMenuButton from '../buttons/SecondaryMenuButton'

import styles    from './VerticalSecondaryMenu.scss'


export default function VerticalSecondaryMenu ({ content, selected, onBack })  {

  const prepareMenuButton = (object,index) => {
    return <SecondaryMenuButton key={index} label={object.label} onClick={object.onClick} type={object.type} state={object.key===selected && 'selected'}/>
  }

  return (
    <div className={styles.menu}>
      <SecondaryMenuButton label={'< Admin'} onClick={onBack} state={'back'}/>
      {content.map(prepareMenuButton)}
    </div>
  )
}
