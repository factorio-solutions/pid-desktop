import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase       from '../_shared/containers/pageBase/PageBase'
import Form           from '../_shared/components/form/Form'
import Dropdown       from '../_shared/components/dropdown/Dropdown'
import PatternInput   from '../_shared/components/input/PatternInput'

import * as newRentActions from '../_shared/actions/newRent.actions'
import * as nav            from '../_shared/helpers/navigation'
import { t }               from '../_shared/modules/localization/localization'

import styles from './newRent.page.scss'


export class NewRentPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initRent(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm       = () => { actions.submitNewRent(this.props.params.id) }
    const goBack           = () => { nav.to(`/garages`) }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const checkSubmitable = () => {
      if (state.name.value == undefined || state.name.value == ''|| !state.name.valid) return false
      if (state.price.value == undefined || state.price.value == ''|| !state.price.valid) return false
      if (state.selectedCurrency == undefined) return false

      return true
    }

    const currencies = () => {
      return state.currencies.map((currency, index) => {
        return { label: currency.code, onClick: actions.setCurrency.bind(this, index) }
      })
    }

    const content = <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
                      <div>
                        <PatternInput onChange={actions.setName} label={t(['newRent', 'name'])} error={t(['newRent', 'invalidName'])} placeholder={t(['newRent', 'namePlaceholder'])} value={state.name.value || ''} highlight={state.highlight}/>
                        <Dropdown label={t(['newRent', 'selectCurrency'])} content={currencies()} style='light' selected={state.selectedCurrency} highlight={state.highlight}/>
                      </div>
                      <div>
                        <h2>{t(['newRent', 'price'])}</h2>
                        <PatternInput onChange={actions.setPrice} label={t(['newRent', 'price'])} error={t(['newRent', 'invalidPrice'])} pattern="^[+]?\d+([,.]\d+)?$" placeholder={t(['newRent', 'pricePlaceholder'])} value={state.price.value || ''} highlight={state.highlight}/>
                      </div>
                    </Form>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.newRent }),
  dispatch => ({ actions: bindActionCreators(newRentActions, dispatch) })
)(NewRentPage)