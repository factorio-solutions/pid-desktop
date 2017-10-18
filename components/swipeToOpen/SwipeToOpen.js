import React, { Component, PropTypes } from 'react'
import ReactSwipe from 'react-swipe'

import styles from './SwipeToOpen.scss'


const INITIAL_STATE = { swept: false }

export default class SwipeToOpen extends Component {
  static propTypes = { onSwipe: PropTypes.func, // triggers on swipe
    success: PropTypes.bool, // set this only when onSwipe finishes
    message: PropTypes.string,
    content: PropTypes.object // main page content
  }

  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
  }

  render() {
    const { onSwipe, success, message, content } = this.props
    const swipeOptions = {
      continuous: false,
      callback:   () => this.setState({ swept: true }, onSwipe)
    }

    return (
      <div className={styles.swiper}>
        <ReactSwipe className={`${this.state.swept && styles.noPointerEvents} ${styles.container}`} swipeOptions={swipeOptions}>
          <div>
            {content}
          </div>

          <div className={`${styles.message} ${success !== undefined ? (success ? styles.success : styles.failure) : null}`} >
            <div>
              {success === undefined && <div><span className={`fa fa-spinner ${styles.rotating}`} aria-hidden="true"></span></div>}
              <div>{message}</div>
            </div>
          </div>
        </ReactSwipe>
      </div>
    )
  }
}
