import React    from 'react'

import styles   from './MasterPage.scss'


// this is scaling page used on login and reservation page
export default function MasterPage ({content})  {
  return(
    <div className={styles.masterLoginPage}>
      {content}
    </div>
  )
}
