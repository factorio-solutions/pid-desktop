import React from 'react'

import Button from './Button.js'

import styles from './ButtonGroup.scss'


export default function ButtonGroupButton({ content, onClick, state }) {
  const style = [
    styles.button,
    styles[state]
  ].join(' ')

  return <Button content={content} onClick={onClick} state={state} style={style} />
}
