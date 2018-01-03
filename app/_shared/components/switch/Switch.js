import React    from 'react'
import styles   from './Switch.scss'

// on: true/false
// onClick: function

export default function Switch ({ on, onClick, state })  {
  return (
    <button onClick={state!=='disabled' && onClick} className={`${styles.switchContainer} ${on ? styles.on : styles.off } ${styles[state]}`}>
      <div className={`${styles.switch} ${on? styles.on : styles.off } ${styles[state]}`} />
    </button>
  )
}
