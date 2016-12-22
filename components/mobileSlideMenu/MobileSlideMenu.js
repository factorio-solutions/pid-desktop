import React    from 'react'
import styles   from './MobileSlideMenu.scss'


export default function MobileSlideMenu ({ content, show, dimmerClick})  {

    return (<div>
              <div onClick={dimmerClick} className={`${styles.dimmer} ${show ? '' : styles.hidden}`}></div>
              <div className={`${styles.menu} ${show ? styles.shown : ''}`}>
                {content}
              </div>
            </div>)

}
