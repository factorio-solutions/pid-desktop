import React from 'react'

import ButtonStack  from '../buttonStack/ButtonStack'
import MenuButton   from '../buttons/MenuButton'

import styles from './VerticalMenu.scss'


export default function VerticalMenu ({ labels, selected, revertDivider, size })  {
  const PrepareBottom = (menuItem, index, arr) => {
    return(
      <MenuButton key={index} icon={menuItem.icon} label={menuItem.label} onClick={menuItem.onClick} type={menuItem.type} state={selected==index?'selected':menuItem.state} size={size} count={menuItem.count} />
    )
  }

  const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

  return(
    <ButtonStack divider={divider} revertDivider={revertDivider}>
      {labels.map(PrepareBottom)}
    </ButtonStack>
  )
}
