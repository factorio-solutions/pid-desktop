import React, { Component, PropTypes } from 'react'
import ReactSwipe from 'react-swipe'

import styles from './SwipeToOpen.scss'


// export default class SwipeToOpen extends Component{
//   static propTypes = {
//     onSwipe: PropTypes.func, // triggers on swipe
//     success: PropTypes.bool, // set this only when onSwipe finishes
//     message: PropTypes.string,
//     size:    PropTypes.number,
//     state:   PropTypes.string, // 'disabled' => gray text
//     content: PropTypes.object // main page content
//   }
//
//   render(){
//     const { onSwipe, success, size, message, state, content} = this.props
//
//     const swipeOptions = {
//       continuous: false,
//       callback:() => {
//         document.getElementsByClassName("swipeToOpenComponent")[0].style.pointerEvents='none';
//         typeof onSwipe === "function" && onSwipe()
//       }
//     }
//
//     return(
//       <ReactSwipe className={`swipeToOpenComponent ${styles.container} ${styles[state]}`} swipeOptions={swipeOptions}>
//
//         <div className={`${styles.pane} ${state ? styles.disabledContent : styles.enabledContent}`} >
//           <div style={{height: size+"px"}}>
//             <div className={styles.paneContent}>
//               {content && content}
//               <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
//               <br/>
//               Swipe to open the gate
//               {state === 'disabled' && <div className={styles.comment}>No reservation</div>}
//               {state === 'noGates' && <div className={styles.comment}>No gates are available</div>}
//             </div>
//           </div>
//         </div>
//
//         <div className={`${styles.pane} ${success!=undefined ? (success ? styles.success : styles.failure) : null}`} style={{height: size+"px"}}>
//           <div style={{height: size+"px"}}>
//             <div className={styles.paneContent}>
//               {message}
//             </div>
//           </div>
//         </div>
//
//       </ReactSwipe>
//     )
//   }
// }

const INITIAL_STATE = { swept: false }

export default class SwipeToOpen extends Component {
  static propTypes = { onSwipe: PropTypes.func // triggers on swipe
    , success: PropTypes.bool // set this only when onSwipe finishes
    , message: PropTypes.string
    , content: PropTypes.object // main page content
  }

  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
  }

  render() {
    const { onSwipe, success, message, content } = this.props
    const swipeOptions = { continuous: false
                         , callback: () => this.setState({ swept: true }, onSwipe)
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
