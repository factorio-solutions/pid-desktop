import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'

import styles from './newReservation.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import MobileTable from '../_shared/components/mobileTable/MobileTable'
import Form        from '../_shared/components/form/Form'
import Input       from '../_shared/components/input/Input'

import * as paths                 from '../_resources/constants/RouterPaths'
import * as newReservationActions from '../_shared/actions/mobile.newReservation.actions'


export class NewReservationPlacesPage extends Component {
  constructor(props) {
     super(props);
     this.state = { place_id: props.state.place_id
                  , autoselect: props.state.autoselect
                  }
  }

  componentWillReceiveProps(next){
    this.props.actions.checkGarageChange(this.props.mobileHeader.garage_id, next.mobileHeader.garage_id)
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const { state, actions } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.RESERVATION_ADD)
    }

    const autoRow = () => {
      const autoClicked = () => { this.setState({... this.state, autoselect: true})}
      return(
        <div className={styles.rowContainer}>
          <span onClick={autoClicked} className={this.state.autoselect ? styles.selected : styles.notSelected}>AUTO</span>
        </div>
      )
    }

    const prepareFLoorRows = (floor, index) => {
      const preparePlaces = (place, index) =>{
        const placeClick = () => {
          this.setState({ place_id: place.id, autoselect: false})
        }

        return (
          <span key={index} onClick={placeClick} className={`${styles.placeLabel} ${(!this.state.autoselect && this.state.place_id == place.id) && styles.selectedPlace}`}>{place.label}</span>
        )
      }

      return(
        {
          label: floor.label,
          row: <div key={index} className={styles.rowContainer}>
            {floor.free_places.map(preparePlaces)}
          </div>
        }
      )
    }

    var content = state.availableFloors
      .filter((floor) => { return floor.free_places.length > 0})
      .map(prepareFLoorRows)

    content.unshift({row: autoRow()})

    const isSubmitable = () => {
      if (this.state.autoselect == false && this.state.place_id ==undefined ){return false}
      return true
    }

    const onSubmit = () => {
      if (this.state.autoselect){
        actions.autoselectPlace()
      } else {
        actions.setPlace(this.state.place_id)
      }
      back()
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
    state: mobileNewReservation,
    mobileHeader
  })
}, dispatch => ({
  actions: bindActionCreators(newReservationActions, dispatch)
}))(NewReservationPlacesPage)
