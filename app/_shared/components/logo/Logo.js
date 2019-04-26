import React      from 'react'

import styles     from './Logo.scss'

const Logo = ({ style = 'rect' }) => {
  let errorChecked = false
  const src = `./public/logo/logo-${style}.svg`
  const handleError = e => {
    if (!errorChecked) { // change resource only once, otherwise can chain errors
      e.target.src = './public/logo/logo-rect.svg'
      errorChecked = true
    }
  }

  return (
    <img className={styles.logo} src={src} onError={handleError} />
  )
}

export default Logo
