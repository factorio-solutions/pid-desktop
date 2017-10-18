import React      from 'react'

import styles     from './Logo.scss'


export default function Logo ({ style = 'rect' }) {
  var errorChecked  = false
  const src         = `./public/logo/logo-${style}.svg`
  const handleError = (e) => {
        if (!errorChecked) { // change resource only once, otherwise can chain errors
          e.target.src = './public/logo/logo-rect.svg'
          errorChecked = true
        }
      }

  return (
    <img className={styles.logo} src={src} onError={handleError} />
  )
}
