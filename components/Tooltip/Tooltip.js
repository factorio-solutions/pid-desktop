import React  from 'react'

import styles from './Tooltip.scss'


export default function Tooltip ( { content, visible, mouseX, mouseY } ){
  const style = { left:     mouseX
                , top:      mouseY + 25
                , opacity:  visible ? '1' : '0'
                }

  return(
      <div className={styles.body} style={style}>
        {content}
      </div>
  )
}
