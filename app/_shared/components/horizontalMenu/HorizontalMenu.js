import React, { Component, PropTypes }  from 'react'
<<<<<<< HEAD
import InlineButton                     from '../buttons/InlineButton'
import ButtonStack                      from '../buttonStack/ButtonStack'

export default class HorizontalMenu extends Component {
  static contextTypes = {
    labels: PropTypes.object,
    selected: PropTypes.number
  }

  render(){
    const { labels, selected } = this.props

    if (labels==undefined) {
      return null
    }

    const prepareContent = (item, index, arr) => {
      return <InlineButton key={index} content={item.content} onClick={item.onClick} type={item.type} state={item.state==undefined ? index==selected ? 'selected' : item.state : item.state}/>
    }

    const divider = <span> </span>

    return(
      <ButtonStack divider={divider} style='horizontal'>
        {labels.map(prepareContent)}
      </ButtonStack>
    )
  }
=======

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
>>>>>>> feature/new_api
}
