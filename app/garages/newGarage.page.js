import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'


import PageBase     from '../_shared/containers/pageBase/PageBase'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import Input        from '../_shared/components/input/Input'
import Form         from '../_shared/components/form/Form'
import GarageLayout from '../_shared/components/GarageLayout/GarageLayout'

import * as newGarageActions from '../_shared/actions/newGarage.actions'
import * as nav              from '../_shared/helpers/navigation'
import { t }                 from '../_shared/modules/localization/localization'

import styles from './newGarage.page.scss'


export class NewGaragePage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount () {
    this.props.params.id && this.props.actions.initEditGarage(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    var allFloors = state.floors.filter((floor)=>{return floor.label.length > 0 && floor.scheme.length > 0 })

    const submitForm = () => { actions.submitNewGarage(state) }
    const goBack     = () => { nav.to('/garages') }

    const getGPSLocation = () => {
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode({'address': state.address}, (results, status) => {
        if (status === 'OK') {
          actions.setLat( results[0].geometry.location.lat() )
          actions.setLng( results[0].geometry.location.lng() )
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      })
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      if (state.floors.length == 1 ) return false
      if (state.floors.filter((fl, index, arr)=>{return index != arr.length-1}).find((floor) => {return floor.label == "" || floor.scheme == ""}) != undefined) return false

      return true
    }

    const prepareFloors = (floor, index) => {
      const handleFileSelect      = (value) => { actions.changeScheme(value, index) }
      const handleFloorNameChange = (value) => { actions.changeFloorName(value, index) }
      const handleFloorFromChange = (value) => { actions.changeFloorFrom(value, index) }
      const handleFloorToChange   = (value) => { actions.changeFloorTo(value, index) }
      const fileSelector          = () => { document.getElementsByName(`floor${index}[file]`)[0].click() }
      const removeRow             = () => { actions.removeFloor(index) }

      const deleteButton = () => {
        if (state.floors.length-1 == index){ return null }
        return <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeRow} type='remove' question={t(['newGarage', 'removeFloorRowQuestion'])} />
      }

      return(
        <div className={styles.inline} key={index}>
          <Input style={styles.smallInputWidth}                         onChange={handleFloorNameChange} label={t(['newGarage', 'floorName'])} error={t(['newGarage', 'invalidFloorName'])} value={state.floors[index].label} name={`floor${index}[name]`} placeholder={t(['newGarage', 'placeholderFloor'])}/>
          <Input style={styles.smallInputWidth+" "+styles.middleMargin} onChange={handleFloorFromChange} label={t(['newGarage', 'from'])} error={t(['newGarage', 'invalidFloorFrom'])} value={floor.from} name={`floor${index}[from]`} placeholder={t(['newGarage', 'placeholderFloorFrom'])} type="number" />
          <Input style={styles.smallInputWidth}                         onChange={handleFloorToChange}   label={t(['newGarage', 'to'])} error={t(['newGarage', 'invalidFloorTo'])} value={floor.to} name={`floor${index}[to]`} placeholder={t(['newGarage', 'placeholderFloorTo'])} type="number" min={floor.from}/>
          <Input style={styles.hidden}                                  onChange={handleFileSelect}      label='file' type="file"  name={`floor${index}[file]`} />
          <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={fileSelector} type={state.floors[index].scheme==""?'action':'confirm'} />
          {deleteButton()}
        </div>
      )
    }

    const content = <div className={styles.parent}>
                      <div className={styles.leftCollumn}>
                        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                          <Input onChange={actions.setName} label={t(['newGarage', 'name'])} error={t(['newGarage', 'invalidName'])} value={state.name} name="garage[name]" placeholder={t(['newGarage', 'placeholder'])}/>
                          <Input onChange={actions.setAddress} label={t(['newGarage', 'address'])} error={t(['newGarage', 'invalidAddress'])} value={state.address} name="garage[name]" placeholder={t(['newGarage', 'addressPlaceholder'])} onBlur={getGPSLocation}/>
                          <div className={styles.inline}>
                            <Input style={styles.latLngInputWidth+" "+styles.rightMargin} onChange={actions.setLat} label={t(['newGarage', 'lat'])} error={t(['newGarage', 'invalidLat'])} value={state.lat} name="garage[lat]" placeholder={t(['newGarage', 'latPlaceholder'])}/>
                            <Input style={styles.latLngInputWidth}                        onChange={actions.setLng} label={t(['newGarage', 'lng'])} error={t(['newGarage', 'invalidLng'])} value={state.lng} name="garage[lng]" placeholder={t(['newGarage', 'lngPlaceholder'])}/>
                          </div>

                          {state.floors.map(prepareFloors)}
                        </Form>
                      </div>

                      <div className={styles.rightCollumn}>
                        <GarageLayout
                          svg                   = {allFloors[state.selectedFloor] && allFloors[state.selectedFloor].scheme || "<svg></svg>"}
                          floors                = {allFloors.map((floor) => {return floor.label})}
                          onFloorClick          = {actions.setFloor}
                          onPlaceClick          = {no => op}
                          activeFloor           = {state.selectedFloor}
                          availableFloorsPlaces = {[]}
                          activePlaces          = {[]}
                        />
                      </div>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newGarage }),
  dispatch => ({ actions: bindActionCreators(newGarageActions, dispatch) })
)(NewGaragePage)
