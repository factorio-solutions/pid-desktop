<<<<<<< HEAD
import React, { Component, PropTypes }  from 'react'
import styles                           from './VerticalMenu.scss'
import ButtonStack                      from '../buttonStack/ButtonStack'
import MenuButton                       from '../buttons/MenuButton'

export default class VerticalMenu extends Component {
  static contextTypes = {
    labels:        PropTypes.object,
    selected:      PropTypes.number,
    revertDivider: PropTypes.bool,
    size:          PropTypes.string
  }

  render(){
    const { labels, selected, revertDivider, size } = this.props

    const PrepareBottom = (menuItem, index, arr) => {
      return(
        <MenuButton key={index} icon={menuItem.icon} label={menuItem.label} onClick={menuItem.onClick} type={menuItem.type} state={selected==index?'selected':menuItem.state} size={size} count={menuItem.count} />
      )
    }

    const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

    return(
      <ButtonStack divider={divider} revertDivider={revertDivider} ref='menu'>
        {labels.map(PrepareBottom)}
      </ButtonStack>
    )
  }
=======
import React from 'react'

import ButtonStack  from '../buttonStack/ButtonStack'
import MenuButton   from '../buttons/MenuButton'

import styles from './VerticalMenu.scss'


export default function VerticalMenu ({ labels, selected, revertDivider, size })  {
  const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

  const PrepareBottom = (menuItem, index, arr) => {
    return(
      <div>
        <MenuButton key={index} icon={menuItem.icon} label={menuItem.label} onClick={menuItem.onClick} type={menuItem.type} state={menuItem.key && selected==menuItem.key?'selected':menuItem.state} size={size} count={menuItem.count} />
      </div>
    )
  }

  return(
    <ButtonStack divider={divider} revertDivider={revertDivider}>
      {labels.map(PrepareBottom)}
    </ButtonStack>
  )
>>>>>>> feature/new_api
}
