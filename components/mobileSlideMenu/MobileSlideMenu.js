import React    from 'react'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
import styles   from './MobileSlideMenu.scss'


export default function MobileSlideMenu ({ content, show, dimmerClick})  {
<<<<<<< HEAD

    return (<div>
              <div onClick={dimmerClick} className={`${styles.dimmer} ${show ? '' : styles.hidden}`}></div>
              <div className={`${styles.menu} ${show ? styles.shown : ''}`}>
                {content}
              </div>
            </div>)

=======
  return (
    <div>
      <div onClick={dimmerClick} className={`${styles.dimmer} ${show ? '' : styles.hidden}`}></div>
      <div className={`${styles.menu} ${show ? styles.shown : ''}`}>
        {content}
      </div>
    </div>
  )
>>>>>>> feature/new_api
}
