import React, { Component, PropTypes } from 'react'

// import CallToActionButton from '../buttons/CallToActionButton'

import styles from './Swipe.scss'


export default class Swipe extends Component {
  static propTypes = {
    label:   PropTypes.string.isRequired,
    onSwipe: PropTypes.func.isRequired,
    onEvent: PropTypes.func,
    success: PropTypes.bool,
    error:   PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      touchPoint:     0, // x coordination of where element was grabbed
      sliderPosition: 0,
      swiped:         false,
      reseting:       false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success !== undefined) {
      setTimeout(this.resetSlider, 1000)
    }
  }

  onDragOrMoveStart = event => {
    this.props.onEvent('drag started!')
    this.setState({ ...this.state, touchPoint: this.positionFromEvent(event) - this.sliderDimensions.x })
  }

  onDragOrMove = event => {
    this.props.onEvent('drag is moving!')
    const screenPosition = this.positionFromEvent(event)
    const newPosition = screenPosition - this.trackDimensions.x - this.state.touchPoint
    this.setState({ ...this.state, sliderPosition: this.limitValue(newPosition, 0, this.maxSliderLeft()) })
  }

  onDragOrMoveEnd = event => {
    this.props.onEvent('drag is ended!')
    if (this.state.sliderPosition / this.maxSliderLeft() > 0.95) {
      this.props.onSwipe()
      this.setState({ ...this.state, swiped: true, sliderPosition: this.maxSliderLeft() })
    } else {
      this.resetSlider()
    }
  }

  resetSlider = () => {
    this.setState({
      ...this.state,
      sliderPosition: 0,
      reseting:       true
    })

    const TRANSITION_TIME = 700
    setTimeout(() => this.setState({ ...this.state, swiped: false, reseting: false }), TRANSITION_TIME)
  }

  maxSliderLeft = () => this.trackDimensions.width - this.sliderDimensions.width
  positionFromEvent = event => ((event.targetTouches && event.targetTouches[0].pageX) || event.screenX)
  limitValue = (value, min, max) => value < min ? min : value > max ? max : value
  createDimensionsRef = variableName => element => { if (element) this[variableName] = element.getBoundingClientRect() }

  render() {
    const { label, success, error } = this.props

    // if ('ontouchstart' in document.documentElement) {
      return (
        <div
          className={`${styles.swipe}
            ${this.state.swiped && success === true && styles.swipedSuccess}
            ${this.state.swiped && success === false && styles.swipedError}
          `}
          ref={this.createDimensionsRef('trackDimensions')}
        >
          <div><i className="fa fa-lock" aria-hidden="true" /></div>
          <div>{error || label}</div>
          <div><i className="fa fa-unlock-alt" aria-hidden="true" /></div>

          <div
            className={`${styles.slider}
              ${this.state.swiped && !this.state.reseting && success === undefined && styles.rotating}
              ${this.state.reseting && styles.isReseting}
            `}
            style={{ left: `${this.state.sliderPosition}px` }}
            ref={this.createDimensionsRef('sliderDimensions')}

            onDragStart={this.onDragOrMoveStart}
            onTouchStart={this.onDragOrMoveStart}
            onDrag={this.onDragOrMove}

            onTouchMove={this.onDragOrMove}
            onTouchEnd={this.onDragOrMoveEnd}
            onDragEnd={this.onDragOrMoveEnd}

            // onMouseDown={this.onDragOrMove}
            // onMouseMove={this.onDragOrMoveEnd}
            // onMouseUp={this.onDragOrMoveEnd}
          >
            <div>
              <i className={`fa fa-${this.state.swiped && success ? 'unlock-alt' : 'lock'}`} aria-hidden="true" />
            </div>
          </div>
        </div>
      )
    // } else {
    //   return (
    //     <div className={`${styles.button}`}>
    //       <CallToActionButton
    //         label={error || label}
    //         onClick={this.props.onSwipe}
    //         type={success === undefined ? '' : success ? 'success' : 'remove'}
    //       />
    //     </div>
    //   )
    // }
  }
}
