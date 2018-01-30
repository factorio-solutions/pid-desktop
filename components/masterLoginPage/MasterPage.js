import React    from 'react'

import styles   from './MasterPage.scss'


// this is scaling page used on login and reservation page
export default function MasterPage({ children }) {
  return (
    <div className={styles.masterLoginPage}>
      {children}
    </div>
  )
}
