import React, { Component, PropTypes }  from 'react'

import InlineButton from '../buttons/InlineButton'
import ButtonStack  from '../buttonStack/ButtonStack'

import styles from './HorizontalMenu.scss'


export default function HorizontalMenu ({ labels = [], selected })  {
  const prepareContent = (item, index, arr) => {
    return <InlineButton key={index} content={item.content} onClick={item.onClick} type={item.type} state={item.state==undefined ? index==selected ? 'selected' : item.state : item.state}/>
  }

  return(
    <div className={styles.horizontalMenu}>
      <ButtonStack style='horizontal'>
        {labels.map(prepareContent)}
      </ButtonStack>
    </div>
  )
}
