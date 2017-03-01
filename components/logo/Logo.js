import React      from 'react'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
import styles     from './Logo.scss'


export default function Logo ({ style = 'rect' }) {
<<<<<<< HEAD
  var errorChecked = false
  const src         = `./public/logo/logo-${style}.svg`
      , handleError = (e) => {
=======
  var errorChecked  = false
  const src         = `./public/logo/logo-${style}.svg`
  const handleError = (e) => {
>>>>>>> feature/new_api
        if (!errorChecked) { // change resource only once, otherwise can chain errors
          e.target.src = './public/logo/logo-rect.svg'
          errorChecked = true
        }
      }

  return (
    <img className={styles.logo} src={src} onError={handleError} />
  )
<<<<<<< HEAD

=======
>>>>>>> feature/new_api
}
