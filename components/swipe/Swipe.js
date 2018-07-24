import React, { Component, PropTypes } from 'react'

// import CallToActionButton from '../buttons/CallToActionButton'

import styles from './Swipe.scss'

const TRANSITION_TIME = 700

export default class Swipe extends Component {
  static propTypes = {
    label:   PropTypes.string.isRequired,
    onSwipe: PropTypes.func.isRequired,
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

  onDragOrMoveStart = event => this.setState({ ...this.state, touchPoint: this.positionFromEvent(event) - (this.trackDimensions.x || this.trackDimensions.left) })

  onDragOrMove = event => {
    const screenPosition = this.positionFromEvent(event)
    const newPosition = screenPosition - (this.trackDimensions.x || this.trackDimensions.left) - this.state.touchPoint
    this.setState({ ...this.state, sliderPosition: this.limitValue(newPosition, 0, this.maxSliderLeft()) })
  }

  onDragOrMoveEnd = event => {
    if (this.state.sliderPosition / this.maxSliderLeft() > 0.5) {
      this.setState({ ...this.state, reseting: true, sliderPosition: this.maxSliderLeft() })
      setTimeout(() => this.setState(
        { ...this.state, swiped: true, reseting: false },
        this.props.onSwipe
      ),
      TRANSITION_TIME)
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
    setTimeout(() => this.setState({ ...this.state, swiped: false, reseting: false }), TRANSITION_TIME)
  }

  maxSliderLeft = () => this.trackDimensions.width - this.sliderDimensions.width
  positionFromEvent = event => ((event.targetTouches && event.targetTouches[0].pageX) || event.screenX)
  limitValue = (value, min, max) => value < min ? min : value > max ? max : value
  createDimensionsRef = variableName => element => { if (element) this[variableName] = element.getBoundingClientRect() }

  render() {
    const { label, success, error } = this.props

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
          onDrag={this.onDragOrMove}
          onDragEnd={this.onDragOrMoveEnd}
          
          onTouchStart={this.onDragOrMoveStart}
          onTouchMove={this.onDragOrMove}
          onTouchEnd={this.onDragOrMoveEnd}
        >
          <div>
            <i className={`fa fa-${this.state.swiped && success ? 'unlock-alt' : 'lock'}`} aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }
}
