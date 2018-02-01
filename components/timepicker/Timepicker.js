import React, { Component, PropTypes }  from 'react'
import moment                           from 'moment'
import { t } from '../../modules/localization/localization'

import styles   from './Timepicker.scss'
import Hours    from './Hours'
import Minutes  from './Minutes'


export default class Timepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    time:     PropTypes.string // format HH:mm
  }

  constructor(props) {
    super(props)
    this.state = { selected: this.currentTime(this.props.time) } // dont care about date, take only time
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selected: this.currentTime(nextProps.time) })
  }

  currentTime(time) {
    const minuteString = time ? time.substring(3) : moment().format('mm')
    const hourString = time ? time.substring(0, 2) : moment().format('HH')
    const minute = Math.floor(minuteString / 15) * 15
    return hourString + ':' + ((String(minute).length === 1 ? '0' + minute : minute)) // dont care about date, take only time
  }

  render() {
    const { onSelect } = this.props

    const hoursClicked = hour => {
      const newTime = (String(hour).length === 1 ? '0' + hour : hour) + this.state.selected.substring(2)
      onSelect(newTime)
      this.setState({ selected: newTime })
    }

    const minutesClicked = minutes => {
      const newTime = this.state.selected.substring(0, 3) + (String(minutes).length === 1 ? '0' + minutes : minutes)
      onSelect(newTime)
      this.setState({ selected: newTime })
    }

    const nowClick = () => {
      const time = this.currentTime()
      onSelect(time)
      this.setState({ selected: time })
    }


    return (
      <div className={styles.timePickeContainer}>
        <div className={styles.picker}>
          <Hours time={this.state.selected} onClick={hoursClicked} />
          <Minutes time={this.state.selected} onClick={minutesClicked} />
        </div>
        <div className={styles.buttonContainer}>
          <span onClick={nowClick}>{t([ 'datetimepicker', 'now' ])}</span>
        </div>
      </div>
    )
  }
}
