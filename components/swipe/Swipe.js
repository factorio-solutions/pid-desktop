import React, { Component, PropTypes } from 'react'

import styles from './Swipe.scss'


export default class Swipe extends Component {
  static propTypes = {
    label:   PropTypes.string.isRequired,
    onSwipe: PropTypes.func.isRequired
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

  onDragOrMoveStart = event => this.setState({ ...this.state, touchPoint: this.positionFromEvent(event) - this.sliderDimensions.x })

  onDragOrMove = event => {
    const screenPosition = this.positionFromEvent(event)
    const newPosition = screenPosition - this.trackDimensions.x - this.state.touchPoint
    this.setState({ ...this.state, sliderPosition: this.limitValue(newPosition, 0, this.maxSliderLeft()) })
  }

  onDragOrMoveEnd = event => {
    if (this.state.sliderPosition / this.maxSliderLeft() > 0.95) {
      this.props.onSwipe()
      this.setState({ ...this.state, swiped: true })
      setTimeout(this.resetSlider, 1000)
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
    const { label } = this.props

    return (
      <div className={`${styles.swipe} ${this.state.swiped && styles.swiped}`} ref={this.createDimensionsRef('trackDimensions')}>
        <div><i className="fa fa-lock" aria-hidden="true" /></div>
        <div>{label}</div>
        <div><i className="fa fa-unlock-alt" aria-hidden="true" /></div>

        <div
          className={`${styles.slider} ${this.state.reseting && styles.isReseting}`}
          style={{ left: `${this.state.sliderPosition}px` }}
          ref={this.createDimensionsRef('sliderDimensions')}

          onDragStart={this.onDragOrMoveStart}
          onTouchStart={this.onDragOrMoveStart}
          onDrag={this.onDragOrMove}
          onTouchMove={this.onDragOrMove}
          onTouchEnd={this.onDragOrMoveEnd}
          onDragEnd={this.onDragOrMoveEnd}
        >
          <i className={`fa fa-${this.state.swiped ? 'unlock-alt' : 'lock'}`} aria-hidden="true" />
        </div>
      </div>
    )
  }
}
