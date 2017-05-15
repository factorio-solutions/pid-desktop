import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import GarageSetupPage    from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form               from '../../_shared/components/form/Form'
import Input              from '../../_shared/components/input/Input'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import GarageLayout2      from '../../_shared/components/garageLayout/GarageLayout2'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as garageSetupActions  from '../../_shared/actions/garageSetup.actions'

import styles from './garageSetupGeneral.page.scss'


export class GarageSetupFloorsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  goBack = () => {
    if (this.props.params.id) {
      // TODO: cancel changes
      nav.to(`/${this.props.params.id}/admin/garageSetup/general`)
    } else {
      nav.to( '/addFeatures/garageSetup/general' )
    }
  }

  componentDidMount(){ // uncoment later
    const { state, params, actions} = this.props
    state.availableTarifs.length === 0 && actions.initTarif()
    if (params.id) {
      actions.intiEditGarageFloors(params.id)
    } else {
      if (state.tarif_id == undefined || state.name == "" || state.city == "" || state.line_1 == "" || state.postal_code == "" || state.country == ""){
        this.goBack()
      }
    }
  }

  render() {
    const { state, actions } = this.props

    const allFloors = state.floors.filter((floor)=>{ return floor.label.length > 0 && floor.scheme.length > 0 })
    const goBack = () => { this.goBack() }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const submitForm = () => {
      if (this.props.params.id) {
        actions.updateGarageFloors(this.props.params.id, window.location.href)
      } else {
        nav.to( '/addFeatures/garageSetup/gates' )
      }
    }

    const checkSubmitable = () => {
      // return true // TODO: <--- delete this
      if (state.floors.find((floor) => {return floor.label == "" || floor.scheme == ""}) != undefined) return false

      return true
    }

    const prepareFloors = (floor, index, arr) => {
      const handleFileSelect      = (value) => { actions.scanSVG(value, index) }
      const handleFloorNameChange = (value) => { actions.changeFloorLabel(value, index) }
      const handleFloorFromChange = (value) => { actions.changeFloorFrom(value, index) }
      const handleFloorToChange   = (value) => { actions.changeFloorTo(value, index) }
      const fileSelector          = () => { document.getElementsByName(`floor${index}[file]`)[0].click() }
      const removeRow             = () => { actions.removeFloor(index) }

      const deleteButton = () => {
        return arr.length <= 1 ? null : <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={removeRow} type='remove' question={t(['newGarage', 'removeFloorRowQuestion'])} />
      }

      return(
        <div key={index}>
          <div className={styles.inline}>
            <Input style={styles.smallInputWidth}                         onChange={handleFloorNameChange} label={t(['newGarage', 'floorName'])} error={t(['newGarage', 'invalidFloorName'])} value={state.floors[index].label} name={`floor${index}[name]`} placeholder={t(['newGarage', 'placeholderFloor'], { index: index+1 })} highlight={state.highlight}/>
            <Input style={styles.smallInputWidth+" "+styles.middleMargin} onChange={handleFloorFromChange} label={t(['newGarage', 'from'])}      error={t(['newGarage', 'invalidFloorFrom'])} value={floor.from} name={`floor${index}[from]`} placeholder={t(['newGarage', 'placeholderFloorFrom'])} type="tel"                     highlight={state.highlight}/>
            <Input style={styles.smallInputWidth}                         onChange={handleFloorToChange}   label={t(['newGarage', 'to'])}        error={t(['newGarage', 'invalidFloorTo'])}   value={floor.to} name={`floor${index}[to]`} placeholder={t(['newGarage', 'placeholderFloorTo'])} type="number" min={floor.from}       highlight={state.highlight}/>
            <Input style={styles.hidden}                                  onChange={handleFileSelect}      label='file' type="file"  name={`floor${index}[file]`} accept='.svg' value=''/> { /*has to have empty value attribute, then onChange will fire on same file selected*/ }
            <RoundButton content={<span className='fa fa-file-code-o' aria-hidden="true"></span>} onClick={fileSelector} type={state.floors[index].scheme==""?'action':'confirm'} />
            {deleteButton()}
          </div>
        </div>
      )
    }

    return (
      <GarageSetupPage>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
          <div className={styles.floors}>
            <div className={styles.floorForm}>
              <h2>{t(['newGarage', 'garageFloors'])}</h2>
              {state.floors.map(prepareFloors)}
              <CallToActionButton label={t(['newGarage', 'addFloor'])} onClick={actions.addFloor} />

              <h2>{t(['newGarage', 'garageTemlates'])}</h2>
              <div className={styles.line}>
                <div onClick={()=>{actions.addTemplate('/public/garages/garage1.svg', '1')}}><img src='./public/garages/garage1.svg'/></div>
                <div onClick={()=>{actions.addTemplate('/public/garages/garage2.svg', '2')}}><img src='./public/garages/garage2.svg'/></div>
              </div>
              <div className={styles.line}>
                <div onClick={()=>{actions.addTemplate('/public/garages/garage3.svg', '3')}}><img src='./public/garages/garage3.svg'/></div>
              </div>

              <h2>{t(['newGarage', 'maximumVehicleDimensions'])}</h2>
              <div className={styles.line}>
                <Input onChange={actions.setLength} label={t(['newGarage', 'length'])} error={t(['newGarage', 'invalidLength'])} value={state.length} placeholder={t(['newGarage', 'lengthPlaceholder'])}/>
                <Input onChange={actions.setHeight} label={t(['newGarage', 'height'])} error={t(['newGarage', 'invalidHeight'])} value={state.height} placeholder={t(['newGarage', 'heightPlaceholder'])}/>
              </div>
              <div className={styles.line}>
                <Input onChange={actions.setWidth}  label={t(['newGarage', 'width'])}  error={t(['newGarage', 'invalidWidth'])}  value={state.width}  placeholder={t(['newGarage', 'widthPlaceholder'])}/>
                <Input onChange={actions.setWeight} label={t(['newGarage', 'weight'])} error={t(['newGarage', 'invalidWeight'])} value={state.weight} placeholder={t(['newGarage', 'weightPlaceholder'])}/>
              </div>
            </div>
            <div className={styles.garageLayout}>
              <GarageLayout2
                floors={allFloors}
                onPlaceClick = {(place)=>{console.log('place clicked', place);}}
                showEmptyFloors = {true}
              />
            </div>
          </div>
        </Form>
      </GarageSetupPage>
    )
  }
}

export default connect(
  state    => ({ state: state.garageSetup }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(garageSetupActions, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(GarageSetupFloorsPage)