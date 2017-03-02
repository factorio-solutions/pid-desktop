import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Input    from '../_shared/components/input/Input'
import Form     from '../_shared/components/form/Form'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as newCarActions from '../_shared/actions/newCar.actions'

import styles from './newCar.page.scss'


export class NewCarPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.params.id && this.props.actions.initCar(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitNewCar(this.props.params.id)
    }

    const goBack = () => {
      nav.to('/cars')
    }

    const checkSubmitable = () => {
      if (state.licence_plate == "") return false
      if (state.color == "") return false
      if (state.type == "") return false

      return true
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={actions.setLicencePlate}  label={t(['newCar', 'licencePlate'])} error={t(['newCar', 'licencePlateInvalid'])} value={state.licence_plate} name="client[licence_plate]" placeholder={t(['newCar', 'licencePlatePlaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setColor}         label={t(['newCar', 'color'])}        error={t(['newCar', 'colorInvalid'])}        value={state.color}         name="client[color]"         placeholder={t(['newCar', 'colorPlaceholder'])}/>
                        <Input onEnter={submitForm} onChange={actions.setModel}         label={t(['newCar', 'model'])}        error={t(['newCar', 'modelInvalid'])}        value={state.model}         name="client[model]"         placeholder={t(['newCar', 'modelPlaceholder'])}/>
                        <input type="checkbox" checked={state.lpg || false} onChange={actions.setLPG}/> {t(['newCar', 'lpg'])}
                        <div className={styles.inlineForm}>
                          <Input onEnter={submitForm}                       onChange={actions.setWidth}  label={t(['newCar', 'width'])}  error={t(['newCar', 'widthInvalid'])}  value={state.width}  name="client[width]"  placeholder={t(['newCar', 'widthPlaceholder'])}  type="number"/>
                          <Input onEnter={submitForm} style={styles.middle} onChange={actions.setHeight} label={t(['newCar', 'height'])} error={t(['newCar', 'heightInvalid'])} value={state.height} name="client[height]" placeholder={t(['newCar', 'heightPlaceholder'])} type="number"/>
                          <Input onEnter={submitForm}                       onChange={actions.setLength} label={t(['newCar', 'length'])} error={t(['newCar', 'lengthInvalid'])} value={state.length} name="client[length]" placeholder={t(['newCar', 'lengthPlaceholder'])} type="number"/>
                        </div>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newCar }),
  dispatch => ({ actions: bindActionCreators(newCarActions, dispatch) })
)(NewCarPage)