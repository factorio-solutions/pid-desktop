import React, { Component, PropTypes } from 'react'
import ReactSwipe from 'react-swipe'

import styles from './SwipeToOpen.scss'

const INITIAL_STATE = { swept: false }
const SWIPE_BACK_TIMEOUT = 3000


export default class SwipeToOpen extends Component {
  static propTypes = {
    onSwipe: PropTypes.func, // triggers on swipe
    onReset: PropTypes.func, // triggers on swipe
    success: PropTypes.bool, // set this only when onSwipe finishes
    message: PropTypes.string,
    content: PropTypes.object // main page content
  }

  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success !== undefined && this.props.success !== nextProps.success) {
      setTimeout(() => {
        this.swipe.prev()
        this.props.onReset()
        this.setState({ swept: false })
      }, SWIPE_BACK_TIMEOUT)
    }
  }

  render() {
    const { onSwipe, success, message, content } = this.props

    const swipeOptions = {
      continuous: false,
      callback:   () => this.setState({ swept: true }, onSwipe)
    }

    return (
      <ReactSwipe className={`${this.state.swept && styles.noPointerEvents} ${styles.container}`} swipeOptions={swipeOptions} ref={swipe => { this.swipe = swipe }}>
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
    )
  }
}
