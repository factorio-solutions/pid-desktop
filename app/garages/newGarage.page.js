import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import Input        from '../_shared/components/input/Input'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout'
import GarageLayout2 from '../_shared/components/garageLayout/GarageLayout2'

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

    const submitForm = () => { actions.submitGarage() }
    const goBack     = () => { nav.to('/garages') }
    const handleErrorClick = () => {
      actions.setError(undefined)
      actions.clearForm()
      goBack()
    }

    const getGPSLocation = (index) => {
      var geocoder = new google.maps.Geocoder()
      geocoder.geocode({'address': `${state.gates[index].address.line_1}, ${state.city}, ${state.postal_code}, ${state.country}`}, (results, status) => {
        if (status === 'OK') {
          actions.changeGateAddressLat( results[0].geometry.location.lat(), index )
          actions.changeGateAddressLng( results[0].geometry.location.lng(), index )
        } else {
          console.log(`Geocode was not successful on ${state.gates[index].address.line_1}, ${state.city}, ${state.postal_code}, ${state.country} for the following reason: ` + status);
        }
      })
    }

    const checkSubmitable = () => {
      // return true // TODO: <--- delete this
      if (state.name == "") return false
      if (state.city == "") return false
      if (state.postal_code == "") return false
      if (state.country == "") return false
      if (state.floors.length == 1 ) return false
      if (state.gates.length == 1 ) return false
      if (state.floors.filter((fl, index, arr)=>{return index != arr.length-1}).find((floor) => {return floor.label == "" || floor.scheme == ""}) != undefined) return false
      if (state.gates.filter((gate, index, arr)=>{return index != arr.length-1}).find((gate) => {return gate.label == "" || gate.address.line_1 == ""}) != undefined) return false

      return true
    }

    const prepareGates = (gate, index) => {
      const handleGateLabelChange        = (value) => { actions.changeGateLabel(value, index ) }
      const handleGatePhoneChange        = (value) => { actions.changeGatePhone(value, index ) }
      const handleGatePlacesChange       = (value) => { actions.changeGatePlaces(value, index ) }
      const handleGateAddressLine1Change = (value) => { actions.changeGateAddressLine1(value, index ) }
      const handleGateAddressLine2Change = (value) => { actions.changeGateAddressLine2(value, index ) }
      const handleGateAddressLat         = (value) => { actions.changeGateAddressLat(value, index ) }
      const handleGateAddressLng         = (value) => { actions.changeGateAddressLng(value, index ) }
      const removeGateRow                = () => { actions.removeGate(index) }

      const removeGateButton = () => {
        if (state.gates.length-1 == index){ return null }
        return <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeGateRow} type='remove' question={t(['newGarage', 'removeGateRowQuestion'])} />
      }

      return (
        <div key={index}>
          <div className={styles.inline}>
            <Input style={styles.gatePhoneInputWidth+" "+styles.rightMargin} onChange={handleGateLabelChange} label={t(['newGarage', 'gateLabel'], { index: index+1 })} error={t(['newGarage', 'invalidGateLabel'])} value={gate.label} name={`gate${index}[label]`} placeholder={t(['newGarage', 'placeholderGateLabel'])}/>
            <Input style={styles.gatePhoneInputWidth}                        onChange={handleGatePhoneChange} label={t(['newGarage', 'gatePhone'])} error={t(['newGarage', 'invalidGatePhone'])} value={gate.phone} name={`gate${index}[phone]`} placeholder={t(['newGarage', 'placeholderGatePhone'])} type="tel"/>
            {removeGateButton()}
          </div>
          <Input onChange={handleGatePlacesChange} label={t(['newGarage', 'places'])} error={t(['newGarage', 'invalidPlaces'])} value={gate.places} placeholder={t(['newGarage', 'placesPlaceholder'])} pattern="(\d+\s*)(\s*(,|-)\s*\d+)*"/>
          <Input onChange={handleGateAddressLine1Change} label={t(['newGarage', 'street'])} error={t(['newGarage', 'invalidStreet'])} value={gate.address.line_1} placeholder={t(['newGarage', 'streetPlaceholder'])} onBlur={()=>{getGPSLocation(index)}}/>
          <div className={styles.inline}>
            <Input style={styles.latLngInputWidth+" "+styles.rightMargin} onChange={handleGateAddressLat} label={t(['newGarage', 'lat'])} error={t(['newGarage', 'invalidLat'])} value={gate.address.lat} name="garage[lat]" placeholder={t(['newGarage', 'latPlaceholder'])}/>
            <Input style={styles.latLngInputWidth}                        onChange={handleGateAddressLng} label={t(['newGarage', 'lng'])} error={t(['newGarage', 'invalidLng'])} value={gate.address.lng} name="garage[lng]" placeholder={t(['newGarage', 'lngPlaceholder'])}/>
          </div>
        </div>
      )
    }

    const prepareFloors = (floor, index) => {
      const handleFileSelect      = (value) => { actions.scanSVG(value, index) }
      const handleFloorNameChange = (value) => { actions.changeFloorLabel(value, index) }
      const handleFloorFromChange = (value) => { actions.changeFloorFrom(value, index) }
      const handleFloorToChange   = (value) => { actions.changeFloorTo(value, index) }
      const fileSelector          = () => { document.getElementsByName(`floor${index}[file]`)[0].click() }
      const removeRow             = () => { actions.removeFloor(index) }

      const deleteButton = () => {
        if (state.floors.length-1 == index){ return null }
        return <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeRow} type='remove' question={t(['newGarage', 'removeFloorRowQuestion'])} />
      }

      return(
        <div key={index}>
          <div className={styles.inline}>
            <Input style={styles.smallInputWidth}                         onChange={handleFloorNameChange} label={t(['newGarage', 'floorName'])} error={t(['newGarage', 'invalidFloorName'])} value={state.floors[index].label} name={`floor${index}[name]`} placeholder={t(['newGarage', 'placeholderFloor'], { index: index+1 })}/>
            <Input style={styles.smallInputWidth+" "+styles.middleMargin} onChange={handleFloorFromChange} label={t(['newGarage', 'from'])}      error={t(['newGarage', 'invalidFloorFrom'])} value={floor.from} name={`floor${index}[from]`} placeholder={t(['newGarage', 'placeholderFloorFrom'])} type="tel" />
            <Input style={styles.smallInputWidth}                         onChange={handleFloorToChange}   label={t(['newGarage', 'to'])}        error={t(['newGarage', 'invalidFloorTo'])}   value={floor.to} name={`floor${index}[to]`} placeholder={t(['newGarage', 'placeholderFloorTo'])} type="number" min={floor.from}/>
            <Input style={styles.hidden}                                  onChange={handleFileSelect}      label='file' type="file"  name={`floor${index}[file]`} />
            <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={fileSelector} type={state.floors[index].scheme==""?'action':'confirm'} />
            {deleteButton()}
          </div>
        </div>
      )
    }

    const errorContent = <div className={styles.floatCenter}>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={handleErrorClick} type='confirm'  />
                         </div>



    const content = <div className={styles.parent}>
                      <Modal content={errorContent} show={state.error!=undefined} />

                      <div className={styles.leftCollumn}>
                        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                          <Input onChange={actions.setName}       label={t(['newGarage', 'name'])}       error={t(['newGarage', 'invalidName'])}        value={state.name}        placeholder={t(['newGarage', 'placeholder'])}/>
                          { /*<input type="checkbox" checked={state.lpg} onChange={actions.toggleLPG}/> <span className={styles.pointer} onClick={actions.toggleLPG}> {t(['newGarage', 'lpgAllowed'])} </span> */}
                          <Input onChange={actions.setCity}       label={t(['newGarage', 'city'])}       error={t(['newGarage', 'invalidCity'])}        value={state.city}        placeholder={t(['newGarage', 'cityPlaceholder'])} />
                          <Input onChange={actions.setPostalCode} label={t(['newGarage', 'postalCode'])} error={t(['newGarage', 'invalidPostalCode'])}  value={state.postal_code} placeholder={t(['newGarage', 'postalCodePlaceholder'])} />
                          <Input onChange={actions.setState}      label={t(['newGarage', 'state'])}      error={t(['newGarage', 'invalidCountry'])}     value={state.state}       placeholder={t(['newGarage', 'statePlaceholder'])} />
                          <Input onChange={actions.setCountry}    label={t(['newGarage', 'country'])}    error={t(['newGarage', 'invalidState'])}       value={state.country}     placeholder={t(['newGarage', 'countryPlaceholder'])} />

                          {state.floors.map(prepareFloors)}
                          {state.gates.map(prepareGates)}
                        </Form>
                      </div>

                      <div className={styles.rightCollumn}>
                        {/* <GarageLayout
                          svg                   = {allFloors[state.selectedFloor] && allFloors[state.selectedFloor].scheme || "<svg></svg>"}
                          floors                = {allFloors.map((floor) => {return floor.label})}
                          onFloorClick          = {actions.setFloor}
                          onPlaceClick          = {no => op}
                          activeFloor           = {state.selectedFloor}
                          availableFloorsPlaces = {[]}
                          activePlaces          = {[]}
                        /> */}
                        <GarageLayout2
                          floors={allFloors}
                          onPlaceClick = {(place)=>{console.log('place clicked', place);}}
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
