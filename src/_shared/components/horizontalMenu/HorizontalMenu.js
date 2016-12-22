import React, { Component, PropTypes }  from 'react'

import InlineButton from '../buttons/InlineButton'
import ButtonStack  from '../buttonStack/ButtonStack'


export default function HorizontalMenu ({ labels = [], selected })  {
  const prepareContent = (item, index, arr) => {
    return <InlineButton key={index} content={item.content} onClick={item.onClick} type={item.type} state={item.state==undefined ? index==selected ? 'selected' : item.state : item.state}/>
  }

  return(
    <ButtonStack style='horizontal'>
      {labels.map(prepareContent)}
    </ButtonStack>
  )
}
