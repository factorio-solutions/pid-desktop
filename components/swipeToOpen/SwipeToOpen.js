import React, { Component, PropTypes }  from 'react'
import ReactSwipe                       from 'react-swipe'

import styles                           from './SwipeToOpen.scss'


export default class SwipeToOpen extends Component{
  static propTypes = {
    onSwipe: PropTypes.func, // triggers on swipe
    success: PropTypes.bool, // set this only when onSwipe finishes
    message: PropTypes.string,
    size:    PropTypes.number,
    state:   PropTypes.string, // 'disabled' => gray text
    content: PropTypes.object // main page content
  }

  render(){
    const { onSwipe, success, size, message, state, content} = this.props

    const swipeOptions = {
      continuous: false,
      callback:() => {
        document.getElementsByClassName("swipeToOpenComponent")[0].style.pointerEvents='none';
        typeof onSwipe === "function" && onSwipe()
      }
    }

    return(
      <ReactSwipe className={`swipeToOpenComponent ${styles.container} ${styles[state]}`} swipeOptions={swipeOptions}>

        <div className={`${styles.pane} ${state=='disabled' ? styles.disabledContent : styles.enabledContent}`} >
          <div style={{height: size+"px"}}>
            <div className={styles.paneContent}>
              {content && content}
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              <br/>
              Swipe to open the gate
              {state=='disabled' && <div className={styles.comment}>No reservation</div>}
            </div>
          </div>
        </div>

        <div className={`${styles.pane} ${success!=undefined ? (success ? styles.success : styles.failure) : null}`} style={{height: size+"px"}}>
          <div style={{height: size+"px"}}>
            <div className={styles.paneContent}>
              {message}
            </div>
          </div>
        </div>

      </ReactSwipe>
    )
  }
}
