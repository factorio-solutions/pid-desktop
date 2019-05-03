import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators, compose }          from 'redux'
import moment                          from 'moment'

import withMasterPageConf from '../../../hoc/withMasterPageConf'

import Form               from '../../../_shared/components/form/Form'
import Module             from '../../../_shared/components/module/Module'
import Switch             from '../../../_shared/components/switch/Switch'
import Input              from '../../../_shared/components/input/Input'
import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'
import Modal              from '../../../_shared/components/modal/Modal'
import Checkbox           from '../../../_shared/components/checkbox/Checkbox'

import * as nav               from '../../../_shared/helpers/navigation'
import { t }                  from '../../../_shared/modules/localization/localization'
import * as timeCreditActions from '../../../_shared/actions/admin.timeCredit.actions'
import * as clientActions     from '../../../_shared/actions/clients.actions'
import * as clientUserActions from '../../../_shared/actions/clientUsers.actions'
import { toAdminClients } from '../../../_shared/actions/pageBase.actions'

import styles from './timeCredit.page.scss'


class TimeCreditPage extends Component {
  static propTypes = {
    state:              PropTypes.object,
    pageBase:           PropTypes.object,
    clients:            PropTypes.object,
    users:              PropTypes.object,
    actions:            PropTypes.object,
    clientActions:      PropTypes.object,
    clientUsersActions: PropTypes.object,
    match:              PropTypes.object
  }

  componentDidMount() {
    const {
      actions,
      clientActions,
      clientUsersActions,
      clients,
      pageBase: { garage },
      match: { params }
    } = this.props
    actions.initTimeCredit(+params.client_id)
    clientUsersActions.initClientUsers(+params.client_id)

    // init clients and get the place count
    if (!clients.clients.length) {
      clientActions.initClients()
      garage && clientActions.initGarageContracts()
    }
  }

  checkSubmitable = () => {
    return true
  }

  checkOnetimeAdditionSubmitable = () => {
    if (!this.props.state.amountToAdd) return false
    return true
  }

  toggleTimeCredit = () => this.props.actions.toggleTimeCredit(+this.props.match.params.client_id)

  submitTimeCredit = () => this.checkSubmitable() && this.props.actions.submitTimeCredit(+this.props.match.params.client_id)

  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/clients`)

  submitOnetimeAddition =() => this.checkOnetimeAdditionSubmitable() && this.props.actions.submitOnetimeAddition(+this.props.params.client_id)

  render() {
    const {
      state, actions, clients, users, match: { params }
    } = this.props
    const client = clients.clients.findById(+params.client_id)
    const hoursThisMonth = ((client && client.place_count) || 0) * 24 * moment().daysInMonth()
    const creditsPossibleToDistribute = hoursThisMonth * (state.pricePerHour <= 0 ? Infinity : state.pricePerHour)
    const creditsDistributed = ((client && client.user_count) || 0) * state.monthlyAmount

    return (
      <React.Fragment>
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

            <div className={styles.alignLeft}>
              <Checkbox
                checked={state.usersToAdd.length === 0}
                onChange={state.usersToAdd.length && actions.eraseUsers}
              >
                {t([ 'newClient', state.add ? 'addToEveryone' : 'removeFromEveryone' ])}
              </Checkbox>

              <div className={styles.alignCenter}><h3>{t([ 'newClient', 'or' ])}</h3></div>

              <h4 className={styles.noMarginBottom}>{t([ 'newClient', 'selectUsers' ])}</h4>
              <div className={styles.users}>
                {users.users.map(({ user }) => (
                  <Checkbox
                    checked={state.usersToAdd.includes(user.id)}
                    onChange={() => actions.toggleUser(user.id)}
                  >
                    {[ user.full_name,
                      user.email,
                      user.phone
                    ].join(', ')}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Form>
        </Modal>

        <Module
          name={t([ 'newClient', 'timeCredit' ])}
          description={t([ 'newClient', 'timeCreditDescription' ])}
          actions={(
            <Switch
              on={state.active}
              onClick={this.toggleTimeCredit}
            />
)}
        />

        <div>
          <h2>{t([ 'newClient', 'timeCreditStatistics' ])}</h2>
          <table>
            <tbody>
              <tr>
                <td>
                  {t([ 'newClient', 'hoursThatCanBeParked' ])}








:
</td>
                <td>{hoursThisMonth}</td>
              </tr>
              <tr>
                <td>
                  {t([ 'newClient', 'creditsThatCanBeDistributed' ])}








:
</td>
                <td>{creditsPossibleToDistribute}</td>
              </tr>
              <tr>
                <td>
                  {t([ 'newClient', 'creditsDistributed' ])}








:
</td>
                <td>{creditsDistributed}</td>
              </tr>
              <tr>
                <td>
                  {t([ 'newClient', 'creditsDistributedOverMax' ])}








:
</td>
                <td>{creditsDistributed - creditsPossibleToDistribute}</td>
              </tr>
            </tbody>
          </table>

          {creditsDistributed - creditsPossibleToDistribute > 0
            && (
            <div className={styles.warning}>
              {' '}
              {t([ 'newClient', 'cteditsOutOfBoundException' ])}
              {' '}
            </div>
            )
          }
        </div>

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
              label={t([ 'newClient', 'monthlyAmount' ])}
              value={String(state.monthlyAmount)}
              placeholder={t([ 'newClient', 'monthlyAmountPlaceholder' ])}
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  state:    state.timeCredit,
  pageBase: state.pageBase,
  clients:  state.clients,
  users:    state.clientUsers
})

const mapActionsToProps = dispatch => ({
  actions:            bindActionCreators(timeCreditActions, dispatch),
  clientActions:      bindActionCreators(clientActions, dispatch),
  clientUsersActions: bindActionCreators(clientUserActions, dispatch)
})

const enhancer = compose(
  withMasterPageConf(toAdminClients('timeCredit')),
  connect(mapStateToProps, mapActionsToProps)
)

export default enhancer(TimeCreditPage)
