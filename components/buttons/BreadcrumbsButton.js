import React from 'react'
import styles from './BreadcrumbsButton.scss'
import Button from './Button.js'

// extends Button.js
// state = 'selected', 'disabled'

export default function BreadcrumbsButton({ content, onClick = () => {}, state }) {
  const style = [
    styles.button,
    styles[state]
  ].join(' ')

  return (
    <Button content={content} onClick={() => { state === undefined && onClick() }} state={state} style={style} />
  )
}
