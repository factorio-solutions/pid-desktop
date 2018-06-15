import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import ClientModules      from './clientModules.page'
import Form               from '../../../_shared/components/form/Form'
import Module             from '../../../_shared/components/module/Module'
import Switch             from '../../../_shared/components/switch/Switch'
import Input              from '../../../_shared/components/input/Input'
import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'
import Modal              from '../../../_shared/components/modal/Modal'

import * as nav               from '../../../_shared/helpers/navigation'
import { t }                  from '../../../_shared/modules/localization/localization'
import * as timeCreditActions from '../../../_shared/actions/admin.timeCredit.actions'

import styles from './timeCredit.page.scss'


class TimeCreditPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initTimeCredit(+this.props.params.client_id)
  }

  checkSubmitable = () => {
    return true
  }

  checkOnetimeAdditionSubmitable = () => {
    if (!this.props.state.amountToAdd) return false
    return true
  }

  toggleTimeCredit = () => this.props.actions.toggleTimeCredit(+this.props.params.client_id)
  submitTimeCredit = () => this.checkSubmitable() && this.props.actions.submitTimeCredit(+this.props.params.client_id)
  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/clients`)

  submitOnetimeAddition =() => this.checkOnetimeAdditionSubmitable() && this.props.actions.submitOnetimeAddition(+this.props.params.client_id)

  render() {
    const { state, actions, pageBase } = this.props

    return (
      <ClientModules params={this.props.params}>
        <Modal show={state.showModal}>
          <Form
            onSubmit={this.submitOnetimeAddition}
            submitable={this.checkOnetimeAdditionSubmitable()}
            onBack={() => actions.setShowModal(false)}
            onHighlight={actions.toggleHighlight}
          >
            <h3>{t([ 'newClient', state.add ? 'onetimeAddition' : 'onetimeRemoval' ])}</h3>
            <Input
              onChange={actions.setAmmountToAdd}
              label={t([ 'newClient', state.add ? 'amountToAdd' : 'amountToRemove' ])}
              value={(state.add ? 1 : -1) * state.amountToAdd}
              placeholder={t([ 'newClient', 'onetimeAdditionPlaceholder' ])}
              highlight={state.highlight}
            />
          </Form>
        </Modal>

        <Module
          name={t([ 'newClient', 'timeCredit' ])}
          description={t([ 'modules', 'timeCreditDescription' ])}
          actions={<Switch
            on={state.active}
            onClick={this.toggleTimeCredit}
          />}
        />

        <Form
          onSubmit={this.submitTimeCredit}
          submitable={this.checkSubmitable()}
          onBack={this.goBack}
          onHighlight={actions.toggleHighlight}
        >
          <Input
            onEnter={this.submitTimeCredit}
            onChange={actions.setCurrencyName}
            label={t([ 'newClient', 'currencyName' ])}
            value={state.currencyName}
            placeholder={t([ 'newClient', 'currencyNamePlaceholder' ])}
            highlight={state.highlight}
          />
          <Input
            onEnter={this.submitTimeCredit}
            onChange={actions.setPricePerHour}
            label={t([ 'newClient', 'pricePerHour' ])}
            value={String(state.pricePerHour)}
            placeholder={t([ 'newClient', 'pricePerHourPlaceholder' ])}
            highlight={state.highlight}
          />
          <div className={styles.management}>
            <Input
              onEnter={this.submitTimeCredit}
              onChange={actions.setMonthlyAmount}
              label={t([ 'newClient', 'monthlyAmoun' ])}
              value={String(state.monthlyAmount)}
              placeholder={t([ 'newClient', 'monthlyAmounPlaceholder' ])}
              highlight={state.highlight}
            />
            <LabeledRoundButton
              label={t([ 'newClient', 'onetimeAdd' ])}
              content={<i className="fa fa-plus" aria-hidden="true" />}
              onClick={() => actions.showAddRemoveModal(true)}
              type="confirm"
            />
            <LabeledRoundButton
              label={t([ 'newClient', 'onetimeRemove' ])}
              content={<i className="fa fa-minus" aria-hidden="true" />}
              onClick={() => actions.showAddRemoveModal(false)}
              type="remove"
            />
          </div>
        </Form>
      </ClientModules>
    )
  }
}

export default connect(
  state => ({ state: state.timeCredit, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(timeCreditActions, dispatch) })
)(TimeCreditPage)
