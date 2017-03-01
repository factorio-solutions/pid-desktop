<<<<<<< HEAD
import React, { Component, PropTypes } from 'react'
import ReactDOM                        from 'react-dom'
import styles                          from './Modal.scss'

export default class Modal extends Component {
  static propTypes = {
    content:      PropTypes.object.isRequired, // is the placeholder
    show:         PropTypes.bool
  }

  render(){
    const { content, show } = this.props
    return (<div className={`${styles.dimmer} ${show ? '' : styles.hidden}`}>
              <div className={styles.modal}>
                {content}
              </div>
            </div>)
  }
=======
import React from 'react'

import styles from './Modal.scss'


export default function Modal ({ content, show })  {
  return (
    <div className={`${styles.dimmer} ${show ? '' : styles.hidden}`}>
      <div className={styles.modal}>
        {content}
      </div>
    </div>
  )
>>>>>>> feature/new_api
}
