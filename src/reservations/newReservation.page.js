import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import styles from './newReservation.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import MobileTable from '../_shared/components/mobileTable/MobileTable'
import Form        from '../_shared/components/form/Form'
import Input       from '../_shared/components/input/Input'

import * as paths                 from '../_resources/constants/RouterPaths'
import * as newReservationActions from '../_shared/actions/mobile.newReservation.actions'

export const AVAILABLE_DURATIONS = [2, 4] // two times are currently supported, change them freely


export class NewReservationPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    state:   PropTypes.object,
    mobileHeader: PropTypes.object,
    actions: PropTypes.object
  }

  componentWillReceiveProps(next){
    this.props.actions.checkGarageChange(this.props.mobileHeader.garage_id, next.mobileHeader.garage_id)
  }

  componentDidMount() {
    this.props.actions.initReservation()
  }

  render() {
    const { state, mobileHeader, actions } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.RESERVATIONS)
    }

    const beginsRow = () => {
      const nowClick   = () => { actions.setFromNow(true)}
      const laterClick = () => { router.push(paths.RESERVATION_ADD_BEGINS)}
      return(
        <div className={styles.rowContainer}>
          <span onClick={nowClick} className={`${state.fromNow ? styles.selected : styles.hidden} ${styles.left}`}>NOW</span>
          <span onClick={laterClick} className={`${state.fromNow ? styles.notSelected : styles.hidden} ${styles.right}`}>LATER</span>
          <span onClick={laterClick} className={`${state.fromNow ? styles.hidden : styles.selected } ${styles.right}`}>{moment(state.from).format("dd DD. MM.  HH:mm")}</span>
        </div>
      )
    }

    const endsRow = () => {
      const firstClicked  = () => { actions.setDuration(AVAILABLE_DURATIONS[0])}
      const secondClicked = () => { actions.setDuration(AVAILABLE_DURATIONS[1])}
      const otherClicked  = () => { router.push(paths.RESERVATION_ADD_DURATION)}
      return(
        <div className={styles.rowContainer}>
          <span onClick={firstClicked} className={`${state.duration == AVAILABLE_DURATIONS[0] ? styles.selected : state.duration == undefined ? styles.hidden : styles.notSelected} ${styles.left}`}>{AVAILABLE_DURATIONS[0]}h</span>
          <span onClick={secondClicked} className={`${state.duration == AVAILABLE_DURATIONS[1] ? styles.selected : state.duration == undefined ? styles.hidden : styles.notSelected}`}>{AVAILABLE_DURATIONS[1]}h</span>
          <span onClick={otherClicked} className={`${state.duration == undefined ? styles.hidden : styles.notSelected} ${styles.right}`}>OTHER</span>
          <span onClick={otherClicked} className={`${state.duration == undefined ? styles.selected : styles.hidden} ${styles.right}`}>{moment(state.to).format("dd DD. MM.  HH:mm")}</span>
        </div>
      )
    }

    const placeRow = () => {
      const autoClicked = () => { actions.autoselectPlace()}
      const pickClicked = () => { router.push(paths.RESERVATION_ADD_PLACES)}

      const floor = state.place_id ? state.availableFloors.find((floor)=> {return floor.free_places.find((place)=> {return place.id ==state.place_id})}) : undefined
      const place = floor==undefined ? undefined : (state.place_id ? floor.free_places.find((place) => {return place.id == state.place_id}) : undefined)

      return(
        <div className={styles.rowContainer}>
          <span onClick={autoClicked} className={`${state.autoselect ? styles.selected : styles.notSelected} ${styles.left} ${state.place_id ? null : styles.hidden}`}>AUTO</span>
          <span onClick={pickClicked} className={`${!state.autoselect ? styles.hidden : styles.notSelected} ${styles.right} ${state.place_id ? null : styles.hidden}`}>PICK</span>
          <span onClick={pickClicked} className={`${!state.autoselect ? styles.selected : styles.hidden} ${styles.right} ${state.place_id ? null : styles.hidden}`}>{floor && floor.label} / { place && place.label}</span>
          {mobileHeader.garage_id && <span className={`${state.place_id ? styles.hidden : styles.error } ${styles.right}`}> No available places </span>}
          <span className={`${mobileHeader.garage_id ? styles.hidden : styles.error } ${styles.right}`}> Select garage first </span>
        </div>
      )
    }

    const content = [
      {label: 'Begins', row: beginsRow()},
      {label: 'Ends',   row: endsRow()},
      {label: 'Place',  row: placeRow()}
    ]

    const isSubmitable = () => {
      if ((mobileHeader.garage_id == undefined)
      || (state.place_id == undefined)
      || (state.from == undefined && state.fromNow == false)
      || (state.to== undefined && state.duration == undefined)){
        return false
      }
      return true
    }

    const onSubmit = () => {
      actions.submitReservation(back)
    }

    return (
      <Page label="New reservation" margin={true}>
        <Form onSubmit={onSubmit} onBack={back} submitable={isSubmitable()} mobile={true}>
          <MobileTable content={content} />
        </Form>
      </Page>
    )
  }
}

export default connect(state => {
  const { mobileNewReservation, mobileHeader } = state
  return ({
    mobileHeader,
    state: mobileNewReservation
  })
}, dispatch => ({
  actions: bindActionCreators(newReservationActions, dispatch)
}))(NewReservationPage)
