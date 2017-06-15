import React  from 'react'

import styles from './Tooltip.scss'


export default function Tooltip ( { content, visible, mouseX, mouseY, refs } ){
  const style = { left:     mouseX + 5
                , top:      mouseY
                , opacity:  visible ? '1' : '0'
                }

  return(
      <div className={`${styles.body} ${window.innerHeight*3/4 < mouseY && styles.originOnBottom} ${window.innerHeight/4 > mouseY && styles.originOnTop}`} style={style}>
        {content}
      </div>
  )
}
