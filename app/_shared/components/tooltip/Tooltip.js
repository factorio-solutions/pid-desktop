import React  from 'react'

import styles from './Tooltip.scss'


export default function Tooltip({ content, visible, mouseX, mouseY, style }) {
  const newStyles = {
    ...style,
    left: mouseX + 5,
    top:  mouseY
  }

  return visible ?
    <div
      className={`
        ${styles.body}
        ${(window.innerHeight / 4) * 3 < mouseY && styles.originOnBottom}
        ${window.innerHeight / 4 > mouseY && styles.originOnTop}
        ${(window.innerWidth / 3) * 2 < mouseX && styles.originOnLeft}
      `}
      style={newStyles}
    >{ content }</div> :
    null
}
