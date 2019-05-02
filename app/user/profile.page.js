import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import update from 'immutability-helper'
import moment from 'moment'

import withMasterPageConf from '../hoc/withMasterPageConf'

import Localization       from '../_shared/components/localization/Localization'
import PatternInput       from '../_shared/components/input/PatternInput'
import Form               from '../_shared/components/form/Form'
import Table              from '../_shared/components/table/Table'
import RoundButton        from '../_shared/components/buttons/RoundButton'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'
import Checkbox           from '../_shared/components/checkbox/Checkbox'
import Documents          from '../admin/garageSetup/legalDocuments/documents'

import * as nav            from '../_shared/helpers/navigation'
import { t }               from '../_shared/modules/localization/localization'
import * as profileActions from '../_shared/actions/profile.actions'
import { setCustomModal, toProfile }  from '../_shared/actions/pageBase.actions'

import styles from './profile.page.scss'
import Input from '../_shared/components/input/Input'

const SHOW_CALENDAR_HASH = true

class SettingsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUser()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitUser()
    }

    const checkSubmitable = () => {
      return state.name.valid && state.phone.valid // && state.email.valid
    }

    const schema = [
      {
        key:         'name',
        title:       t([ 'newCar', 'name' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>,
        sort:        'asc'
      },
      {
        key:         'licence_plate',
        title:       t([ 'cars', 'licencePlate' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>
      },
      { key: 'model', title: t([ 'cars', 'model' ]), comparator: 'string' },
      { key: 'color', title: t([ 'cars', 'color' ]), comparator: 'string' }
    ]

    const addCar = () => nav.to('/profile/cars/newCar')

    const addSpoiler = car => {
      const toCar = () => nav.to(`/profile/cars/${car.id}/users`)
      const toEditCar = () => nav.to(`/profile/cars/${car.id}/edit`)
      const destroyCar = () => actions.destroyCar(car.id)

      const spoiler = (
        <span className={styles.floatRight}>
          <RoundButton content={<span className="fa fa-pencil" aria-hidden="true" />} onClick={toEditCar} type="action" state={car.admin ? '' : 'disabled'} />
          <RoundButton content={<span className="fa fa-child" aria-hidden="true" />} onClick={toCar} type="action" />
          {car.admin && <RoundButton content={<span className="fa fa-times" aria-hidden="true" />} onClick={destroyCar} type="remove" question={t([ 'cars', 'destroyCar' ])} />}
        </span>
      )
      return update(car, { spoiler: { $set: spoiler } })
    }

    const emailSentModal = (
      <div style={{ textAlign: 'center' }}>
        { t([ 'profile', 'emailSent' ]) }
        <br />
        <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.setCustomModal} type="confirm" />
      </div>
    )

    return (
      <React.Fragment>
        <div className={styles.parent}>
          <div className={styles.leftColumn}>
            <h2>{t([ 'profile', 'profileSettings' ])}</h2>
            <div>
              <label>{t([ 'profile', 'email' ])}</label>
              {pageBase.current_user && pageBase.current_user.email}
            </div>
            <div>
              <label>{t([ 'profile', 'createdAt' ])}</label>
              {pageBase.current_user && moment(pageBase.current_user.created_at).format('D. M. YYYY H:mm')}
            </div>
            <Form onSubmit={submitForm} submitable={checkSubmitable()} onHighlight={actions.toggleHighlight} submitbtnRight>
              <PatternInput
                onEnter={submitForm}
                onChange={actions.setName}
                label={t([ 'signup_page', 'name' ]) + ' *'}
                error={t([ 'signup_page', 'nameInvalid' ])}
                pattern="^(?!\s*$).+"
                value={state.name.value}
                highlight={state.highlight}
              />
              <PatternInput
                onEnter={submitForm}
                onChange={actions.setPhone}
                label={t([ 'signup_page', 'phone' ]) + ' *'}
                error={t([ 'signup_page', 'phoneInvalid' ])}
                pattern="\+[\d]{2,4}[\d\s]{3,}"
                value={state.phone.value}
                highlight={state.highlight}
              />
              <div>
                <CallToActionButton label={t([ 'profile', 'resetPassword' ])} onClick={() => actions.changePassword(emailSentModal)} />
              </div>

              <div>
                <Checkbox
                  checked={pageBase.current_user && !pageBase.current_user.hide_public_garages}
                  onChange={actions.toggleShowPublicGarages}
                >
                  {<span>{t([ 'profile', 'showPublicGarages' ])}</span>}
                </Checkbox>
              </div>

              <div>
                {t([ 'profile', 'language' ])}
                <Localization />
              </div>
              <h2>{t([ 'profile', 'cars' ])}</h2>
              <div>
                <Table schema={schema} data={state.cars.map(addSpoiler)} />
                <div className={styles.addButton}>
                  <RoundButton content={<span className="fa fa-plus" aria-hidden="true" />} onClick={addCar} type="action" size="big" />
                </div>
              </div>
              <h2>{t([ 'profile', 'privacyDocuments' ])}</h2>
              {state.garages.map(garage => (
                <Documents
                  header={garage.name.firstToUpperCase()}
                  type="privacy"
                  documents={garage.documents.filter(doc => doc.doc_type === 'privacy')}
                  readOnly
                />
              ))}
            </Form>
          </div>
          <div className={styles.rightColumn}>
            {/* HACK: sccale the letters size. */}
            <div style={{ transform: 'scale(1.4)', transformOrigin: '0 0' }}>
              <h3>
                {t([ 'profile', 'myGarages' ])}
                {':'}
              </h3>
              <ul>
                {state.garages.map(garage => (
                  <li>
                    <b>{garage.name}</b>
                    {garage.admin && <span className={styles.rights}>{t([ 'users', 'admin' ])}</span>}
                    {garage.manager && <span className={styles.rights}>{t([ 'garageUsers', 'manager' ])}</span>}
                    {garage.security && <span className={styles.rights}>{t([ 'users', 'security' ])}</span>}
                    {garage.receptionist && <span className={styles.rights}>{t([ 'users', 'receptionist' ])}</span>}
                  </li>
                ))}
              </ul>
              <h3>
                {t([ 'profile', 'myClients' ])}
                {':'}
              </h3>
              <ul>
                {state.clients.map(client => (
                  <li>
                    <b>{client.name}</b>
                    {client.admin && <span className={styles.rights}>{t([ 'users', 'admin' ])}</span>}
                    {client.secretary && <span className={styles.rights}>{t([ 'users', 'secretary' ])}</span>}
                    {client.internal && <span className={styles.rights}>{t([ 'users', 'internal' ])}</span>}
                    {client.host && <span className={styles.rights}>{t([ 'users', 'host' ])}</span>}
                  </li>
                ))}
              </ul>
              <ul>
                {SHOW_CALENDAR_HASH && (
                  state.calendar_hash
                    ? (
                      <Input
                        value={`${window.location.origin}/calendar/${state.calendar_hash}/calendar.ics`}
                      />
                    )
                    : (
                      <CallToActionButton
                        label="Generate calendar link."
                        onClick={actions.generateCalendarHash}
                      />
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toProfile()),
  connect(
    state => ({ state: state.profile, pageBase: state.pageBase }),
    dispatch => ({ actions: bindActionCreators({ ...profileActions, setCustomModal }, dispatch) })
  )
)

export default enhancers(SettingsPage)
