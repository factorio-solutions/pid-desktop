import React    from 'react'
<<<<<<< HEAD
import styles   from './MasterPage.scss'

=======

import styles   from './MasterPage.scss'


>>>>>>> feature/new_api
// this is scaling page used on login and reservation page
export default function MasterPage ({content})  {
  return(
    <div className={styles.masterLoginPage}>
      {content}
    </div>
  )
}
