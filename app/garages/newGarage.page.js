import React, { Component, PropTypes } from 'react';
import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'

import PageBase             from '../_shared/containers/pageBase/PageBase'
import RoundButton          from '../_shared/components/buttons/RoundButton'
import Input                from '../_shared/components/input/Input'
import Form                 from '../_shared/components/form/Form'
import GarageLayout         from '../_shared/components/GarageLayout/GarageLayout'

import { setFloors, removeFloor, changeFloorName, changeScheme, setName, submitNewGarage,
         setAddress, setGPS, setFloor, initEditGarage, changeFloorFrom, changeFloorTo} from '../_shared/actions/newGarage.actions'

import styles from './newGarage.page.scss'

export default class NewGaragePage extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount () {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })
    this.props.params.id && store.dispatch(initEditGarage(this.props.params.id))
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render() {
    const { store } = this.context
    const state = store.getState().newGarage

    const handleNameChange = (value) => {
      store.dispatch(setName(value))
    }

    const handleAddressChange = (value) => {
      store.dispatch(setAddress(value))
    }

    const handleGPSChange = (value) => {
      store.dispatch(setGPS(value))
    }

    const submitForm = () => {
      store.dispatch(submitNewGarage(state))
    }

    const goBack = () => {
      nav.to('/garages')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      if (state.floors.length == 1 ) return false
      if (state.floors.filter((fl, index, arr)=>{return index != arr.length-1}).find((floor) => {return floor.label == "" || floor.scheme == ""}) != undefined) return false

      return true
    }

    const prepareFloors = (floor, index) => {
      const handleFileSelect      = (value) => {store.dispatch(changeScheme(value, index))}
      const handleFloorNameChange = (value) => {store.dispatch(changeFloorName(value, index))}
      const handleFloorFromChange = (value) => {store.dispatch(changeFloorFrom(value, index))}
      const handleFloorToChange   = (value) => {store.dispatch(changeFloorTo(value, index))}
      const fileSelector = () => {document.getElementsByName(`floor${index}[file]`)[0].click()}
      const removeRow    = () => { store.dispatch(removeFloor(index)) }

      const deleteButton = () => {
        if (state.floors.length-1 == index){ return null }
        return <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeRow} type='remove' question={t(['newGarage', 'removeFloorRowQuestion'])} />
      }

      return(
        <div className={styles.inline} key={index}>
          <Input style={styles.smallInputWidth} onChange={handleFloorNameChange} label={t(['newGarage', 'floorName'])} error={t(['newGarage', 'invalidFloorName'])} value={state.floors[index].label} name={`floor${index}[name]`} placeholder={t(['newGarage', 'placeholderFloor'])}/>
          <Input style={styles.smallInputWidth+" "+styles.middleMargin} onChange={handleFloorFromChange} label={t(['newGarage', 'from'])} error={t(['newGarage', 'invalidFloorFrom'])} value={floor.from} name={`floor${index}[from]`} placeholder={t(['newGarage', 'placeholderFloorFrom'])} type="number" />
          <Input style={styles.smallInputWidth} onChange={handleFloorToChange} label={t(['newGarage', 'to'])} error={t(['newGarage', 'invalidFloorTo'])} value={floor.to} name={`floor${index}[to]`} placeholder={t(['newGarage', 'placeholderFloorTo'])} type="number" min={floor.from}/>
          <Input style={styles.hidden} type="file" onChange={handleFileSelect} name={`floor${index}[file]`} label='file' />
          <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={fileSelector} type={state.floors[index].scheme==""?'action':'confirm'} />
          {deleteButton()}
        </div>
      )
    }

    const handleFloorClick = ( index ) => {
      store.dispatch(setFloor(index))
    }

    var allFloors = state.floors.filter((floor)=>{return floor.label.length > 0 && floor.scheme.length > 0 })

    const content = <div className={styles.parent}>
                      <div className={styles.leftCollumn}>
                        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                          <Input onChange={handleNameChange} label={t(['newGarage', 'name'])} error={t(['newGarage', 'invalidName'])} value={state.name} name="garage[name]" placeholder={t(['newGarage', 'placeholder'])}/>
                          <Input onChange={handleAddressChange} label={t(['newGarage', 'address'])} error={t(['newGarage', 'invalidAddress'])} value={state.address} name="garage[name]" placeholder={t(['newGarage', 'addressPlaceholder'])}/>
                          <Input onChange={handleGPSChange} label={t(['newGarage', 'GPS'])} error={t(['newGarage', 'invalidGPS'])} value={state.GPS} name="garage[name]" placeholder={t(['newGarage', 'GPSPlaceholder'])}/>
                          {state.floors.map(prepareFloors)}
                        </Form>
                      </div>
                      <div className={styles.rightCollumn}>
                        <GarageLayout
                          svg={allFloors[state.selectedFloor] && allFloors[state.selectedFloor].scheme || "<svg></svg>"}
                          floors={allFloors.map((floor) => {return floor.label})}
                          onFloorClick={handleFloorClick}
                          onPlaceClick={no => op}
                          availableFloorsPlaces={[]}
                          activeFloor={state.selectedFloor}
                          activePlaces={[]}
                        />
                      </div>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}
