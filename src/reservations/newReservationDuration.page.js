import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import { AVAILABLE_DURATIONS } from './newReservation.page'
import styles                  from './newReservation.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import MobileTable from '../_shared/components/mobileTable/MobileTable'
import Form        from '../_shared/components/form/Form'
import Input       from '../_shared/components/input/Input'

import * as paths                 from '../_resources/constants/RouterPaths'
import * as newReservationActions from '../_shared/actions/mobile.newReservation.actions'



export class NewReservationDurationPage extends Component {
  constructor(props) {
     super(props);
     this.state = {
       from:     props.state.from,
       to:       props.state.to,
       duration: props.state.duration
     }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentWillReceiveProps(next){
    this.props.actions.checkGarageChange(this.props.mobileHeader.garage_id, next.mobileHeader.garage_id)
  }

  componentDidMount() {
    setTimeout(function(){ // HACK: opening date time input - Android tested
      document.getElementsByClassName(styles.dateInput)[0].click()
    }, 25)
  }

  render() {
    const { state, actions } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.RESERVATION_ADD)
    }

    const durationRow = () => {
      const firstClicked  = () => { this.setState({duration: AVAILABLE_DURATIONS[0], to: undefined}) }
      const secondClicked = () => { this.setState({duration: AVAILABLE_DURATIONS[1], to: undefined}) }
      const handleDuration = (event) => { event.target.checkValidity() && this.setState({duration: undefined, to: event.target.value}) }

      const fromTime = this.state.from ? moment(this.state.from) : moment()

      return(
        <div>
          <div className={styles.rowContainer}>
          <span onClick={firstClicked} className={`${this.state.duration == AVAILABLE_DURATIONS[0] ? styles.selected : styles.notSelected} ${styles.left}`}>{AVAILABLE_DURATIONS[0]}h</span>
          <span onClick={secondClicked} className={`${this.state.duration == AVAILABLE_DURATIONS[1] ? styles.selected : styles.notSelected}`}>{AVAILABLE_DURATIONS[1]}h</span>
          </div>
          <input className={styles.dateInput} type="datetime-local" value={this.state.to || moment(fromTime.add(this.state.duration, 'hours')).format('YYYY-MM-DDTHH:mm')} onChange={handleDuration}/>
        </div>
      )
    }

    const content = [
      {label: 'Duration', row: durationRow()}
    ]

    var from = state.fromNow ? moment() : state.from
    var fromBeforeTo = this.state.to ? moment(this.state.to).diff(moment(from)) > 0 : true

    const isSubmitable = () => {
      if (!fromBeforeTo) { return false }
      if (state.to== undefined && state.duration == undefined){ return false }
      return true
    }

    const onSubmit = () => {
      actions.setDuration(this.state.duration)
      actions.setTo(this.state.to)
      back()
    }

    return (
      <Page label="New reservation" margin={true}>
        <Form onSubmit={onSubmit} onBack={back} submitable={isSubmitable()} mobile={true}>
          <MobileTable content={content} />
          <p className={ fromBeforeTo ? styles.hidden : styles.error}>
            Hey! <br/>
            Duration cannot be negative... <br/>
            Begining is set to {state.fromNow ? "NOW" : moment(state.from).format("dd DD. MM.  HH:mm")}
          </p>
        </Form>
      </Page>
    )
  }
}

export default connect(state => {
  const { mobileNewReservation, mobileHeader } = state
  return ({
    state: mobileNewReservation,
    mobileHeader
  })
}, dispatch => ({
  actions: bindActionCreators(newReservationActions, dispatch)
}))(NewReservationDurationPage)
