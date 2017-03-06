import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import styles from './newReservation.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import MobileTable from '../_shared/components/mobileTable/MobileTable'
import Form        from '../_shared/components/form/Form'
import Input       from '../_shared/components/input/Input'
import Dropdown    from '../_shared/components/dropdown/Dropdown'
import Braintree   from '../_shared/components/braintree/Braintree'
import RoundButton from '../_shared/components/buttons/RoundButton'

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

    const clientDropdown = () => {
      const clientSelected = (index) => { actions.setClientId(state.availableClients[index].id) }
      let clients = state.availableClients.map((client, index) => {
        return { label: client.name, onClick: clientSelected.bind(this, index) }
      })
      return clients
    }

    const carDropdown = () => {
      const carSelected = (index) => { actions.setCarId(state.availableCars[index].id) }
      return state.availableCars.map((car, index) => {
        return { label: car.model, onClick: carSelected.bind(this, index) }
      })
    }

    const carRow = () => {
      return state.availableCars.length==0 ? <Input onChange={actions.setCarLicencePlate} value={state.carLicencePlate} label="Licence plate" error="Invalid licence plate" placeholder="1A2 3456" type='text' name='reservation[licence_plate]' align='center'/>
                                           : <Dropdown label="Select car"    content={carDropdown()}    selected={state.availableCars.findIndex((car)=>{return car.id == state.car_id})} style='light'/>
    }
    const clientsRow = () =>{
      return <Dropdown label="Select client" content={clientDropdown()} selected={state.availableClients.findIndex((client)=>{return client.id == state.client_id})} style='light'/>
    }

    const price = () => {
      var from = state.fromNow ? moment(moment()).set('minute', Math.floor(moment(moment()).minutes()/15)*15) : moment(state.from)
      var to = state.duration ? moment(moment(from).add(state.duration, 'hours')) : moment(state.to)
      from = from.unix()
      to = to.unix()

      let times = [from]
      while (times[times.length-1] + 900 < to) { // 900 is 15 mins
        times = times.concat(times[times.length-1] + 900)
      }
      times = times.concat(to)
      times.shift()

      if (state.availableFloors == undefined ){ return 0 }

      const place = state.availableFloors.reduce((sum, floor)=> {
        return sum.concat(floor.free_places)
      }, []).find((place) => { return place.id == state.place_id})

      if (place){
        var price = place.pricings[0]
      } else {
        return 0
      }

      let ammount = times.reduce((sum, timestamp) => {
        const date = moment(timestamp*1000)
        switch (true) {
          case price.weekend_price !== null && (date.isoWeekday() == 6 || date.isoWeekday() == 7):
            sum += price.weekend_price*0.25
            break
          case price.flat_price !== null:
            sum += price.flat_price*0.25
            break
          case price.exponential_12h_price !== null && state.duration<12:
            sum += price.exponential_12h_price*0.25
            break
          case price.exponential_day_price !== null && state.duration<24:
            sum += price.exponential_day_price*0.25
            break
          case price.exponential_week_price !== null && state.duration<168:
            sum += price.exponential_week_price*0.25
            break
          case price.exponential_month_price !== null:
            sum += price.exponential_month_price*0.25
            break
        }
        return sum
      }, 0)
      return ammount + " "+ price.currency.symbol
    }

    let content = [
      {label: 'Begins', row: beginsRow()},
      {label: 'Ends',   row: endsRow()},
      {label: 'Place',  row: placeRow()},
      {label: 'Car',    row: carRow()}
    ]
    state.availableClients.length>1 && content.push({label: 'Client',  row: clientsRow() })
    content.push({label: 'Price',  row: state.client_id ? "On clients expenses" : price() })

    const isSubmitable = () => {
      if ((mobileHeader.garage_id == undefined)
      || (state.place_id == undefined)
      || (state.from == undefined && state.fromNow == false)
      || ((state.carLicencePlate == undefined || state.carLicencePlate == '') && state.car_id == undefined)
      || (state.to== undefined && state.duration == undefined)){
        return false
      }
      return true
    }

    const formOnSubmit = (evt) => {
      evt.preventDefault()
      state.client_id && isSubmitable() && actions.submitReservation(undefined, back)
      return false
    }

    const onPayment = (payload) => {
      console.log(payload);
      // isSubmitable() &&
      actions.submitReservation(payload, back)
    }

    return (
      <Page label="New reservation" margin={true}>
        <form className={styles.form} onSubmit={formOnSubmit}>
          <MobileTable content={content} />
          {state.client_id==undefined && state.braintree_token && <Braintree token={state.braintree_token} onPayment={onPayment} paypal={false}/>}
          <div className={styles.mobileSubmitButton }>
            {back && <div className={styles.floatLeft}>
              <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={back}/>
            </div>}
            <div className={back && styles.floatRight}>
              <button className={`${styles.submitButton} ${isSubmitable() ? '' : styles.disabled }`} type="submit"> <span className='fa fa-check' aria-hidden="true"></span> </button>
            </div>
          </div>
        </form>
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
