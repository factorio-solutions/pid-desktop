import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import * as nav                        from '../../_shared/helpers/navigation'
import { t }                           from '../../_shared/modules/localization/localization'

import PageBase     from '../../_shared/containers/pageBase/PageBase'
import Dropdown     from '../../_shared/components/dropdown/Dropdown'
import Form         from '../../_shared/components/form/Form'
import PatternInput from '../../_shared/components/input/PatternInput'
import Modal        from '../../_shared/components/modal/Modal'
import RoundButton  from '../../_shared/components/buttons/RoundButton'

import * as inviteUserActions from '../../_shared/actions/inviteUser.actions'

import styles from './inviteUser.page.scss'


class inviteUserPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initManagebles()
  }

  render() {
    const {state, actions} = this.props

    const submitForm       = () => { checkSubmitable() && actions.createNewManagebles() }
    const goBack           = () => { nav.back() }
    const emailChanged     = (value, valid) => { actions.setEmail({ value, valid }) }
    const messageChanged   = (event) => { actions.setMessage(event.target.value) }
    const nameChanged      = (value, valid) => { actions.setName(value) }
    const phoneChanged     = (value, valid) => { actions.setPhone(value) }
    const hightlightInputs = () => { actions.toggleHighlight() }

    const checkSubmitable = () => {
      if (!state.email.valid) return false
      if (!/\+?\(?\d{2,4}\)?[\d\s-]{3,}/.test(state.phone) && state.phone!=="" ) return false
      if (!/^(?!\s*$).+/.test(state.full_name) && state.phone!=="" ) return false
      return true
    }

    const modalClick = () => {
      actions.dismissModal()
      goBack()
    }

    const successClick = () => {
      actions.dismissModal()
      goBack()
    }

    const clientSelected = (index) => { actions.setClient(state.clients[index].id) }
    const clientDropdown = state.clients.map((client, index) => {return {label: client.name, onClick: clientSelected.bind(this, index) }})
    const currentClient = state.clients.find(client => client.id !== undefined && client.id === state.client_id)

    const carSelected = (index) => { actions.setCar(state.cars[index].id) }
    const carDropdown = state.cars.map((car, index) => {return {label: car.model, onClick: carSelected.bind(this, index) }})

    const garageSelected = (index) => { actions.setGarage(state.garages[index].id) }
    const garageDropdown = state.garages.map((garage, index) => {return {label: garage.name, onClick: garageSelected.bind(this, index) }})

    const errorContent = <div className={styles.floatCenter}>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

   const successContent = <div className={styles.floatCenter}>
                           { state.success } <br/>
                          <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={successClick} type='confirm'  />
                        </div>

    const loadingContent = <div className={styles.floatCenter}>
                             {t(['inviteUser', 'sendingInvitation'])}: <br/>
                             { state.currentEmail }
                           </div>

    return (
      <PageBase>
        <Modal content={errorContent} show={state.error!=undefined} />
        <Modal content={successContent} show={state.success!=undefined} />
        <Modal content={loadingContent} show={state.currentEmail!=undefined} />

        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack} onHighlight={hightlightInputs}>
        <div className={styles.form}>
          <div className={`${styles.formChild} ${styles.mainInfo}`}>
            <PatternInput onEnter={submitForm} onChange={emailChanged} label={t(['inviteUser', 'selectUser'])} error={t(['signup_page', 'emailInvalid'])} pattern="^([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3},*[\W]*)+$" value={state.email.value} highlight={state.highlight}/>
            {clientDropdown.length > 1 && <Dropdown label={t(['inviteUser', 'selectClient'])} content={clientDropdown} style='light' selected={state.clients.findIndex((client)=>{return client.id == state.client_id})}/>}
            {garageDropdown.length > 1 && <Dropdown label={t(['inviteUser', 'selectGarage'])} content={garageDropdown} style='light' selected={state.garages.findIndex((garage)=>{return garage.id == state.garage_id})}/>}
            {carDropdown.length > 1 && <Dropdown label={t(['inviteUser', 'selectCar'])}    content={carDropdown} style='light' selected={state.cars.findIndex((car)=>{return car.id == state.car_id})}/>}
            <div>
              <label>{t(['inviteUser', 'inviteMessage'])}</label>
            </div>
            <div>
              <textarea className={styles.textArea} onChange={messageChanged} value={state.message} />
            </div>
          </div>

          <div className={`${styles.formChild} ${styles.additionalInfo}`}>
            <h3>{t(['inviteUser', 'optionalSettings'])}</h3>
            <p>{t(['inviteUser', 'optionalSettingsText'])}</p>
            <PatternInput onEnter={submitForm} onChange={nameChanged} label={t(['inviteUser', 'nameLabel'])} error={t(['signup_page', 'nameInvalid'])} pattern="^(?!\s*$).+" value={state.full_name} />
            <PatternInput onEnter={submitForm} onChange={phoneChanged} label={t(['inviteUser', 'phoneLabel'])} error={t(['signup_page', 'phoneInvalid'])} pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" value={state.phone} />
            {state.client_id && <div>
              <h3>{t(['inviteUser', 'clientRights'])}</h3>
              <p>{t(['inviteUser', 'clientRightsDesc'])}</p>
              {currentClient && <p className={styles.rights}>
                {currentClient.admin &&
                  [ <span className={state.client_admin ? styles.boldText : styles.inactiveText}     onClick={()=>{actions.setBooleanAttr('client_admin', !state.client_admin)}}>         {t(['inviteUser','admin'])}</span>
                  , <span>|</span>
                  ]
                }
                {currentClient.admin &&
                  [ <span className={state.client_contact_person ? styles.boldText : styles.inactiveText}     onClick={()=>{actions.setBooleanAttr('client_contact_person', !state.client_contact_person)}}> {t(['inviteUser','contactPerson'])}</span>
                  , <span>|</span>
                  ]
                }
                {currentClient.admin &&
                  [ <span className={state.client_secretary ? styles.boldText : styles.inactiveText} onClick={()=>{actions.setBooleanAttr('client_secretary', !state.client_secretary)}}> {t(['inviteUser','secretary'])}</span>
                  , <span>|</span>
                  ]
                }
                {(currentClient.admin || currentClient.secretary) &&
                  [ <span className={state.client_host ? styles.boldText : styles.inactiveText}      onClick={()=>{actions.setBooleanAttr('client_host', !state.client_host)}}>           {t(['inviteUser','host'])}</span>
                  , <span>|</span>
                  ]
                }
                {(currentClient.admin || currentClient.secretary || currentClient.internal) &&
                  <span className={state.client_internal ? styles.boldText : styles.inactiveText}  onClick={()=>{actions.setBooleanAttr('client_internal', !state.client_internal)}}>   {t(['inviteUser','internal'])}</span>
                }
              </p>}
            </div>}

            {state.garage_id && <div>
              <h3>{t(['inviteUser', 'GarageRights'])}</h3>
              <p>{t(['inviteUser', 'GarageRightsDesc'])}</p>
              <p className={styles.rights}>
                <span className={state.garage_admin ? styles.boldText : styles.inactiveText}        onClick={()=>{actions.setBooleanAttr('garage_admin', !state.garage_admin)}}>               {t(['inviteUser','admin'])}</span>|
                <span className={state.garage_receptionist ? styles.boldText : styles.inactiveText} onClick={()=>{actions.setBooleanAttr('garage_receptionist', !state.garage_receptionist)}}> {t(['inviteUser','receptionist'])}</span>|
                <span className={state.garage_security ? styles.boldText : styles.inactiveText}     onClick={()=>{actions.setBooleanAttr('garage_security', !state.garage_security)}}>         {t(['inviteUser','security'])}</span>
              </p>
            </div>}

            {state.car_id && <div>
              <h3>{t(['inviteUser', 'carRights'])}</h3>
              <p>{t(['inviteUser', 'carRightsDesc'])}</p>
              <p className={styles.rights}>
                <span className={state.car_admin ? styles.boldText : styles.inactiveText}  onClick={()=>{actions.setBooleanAttr('car_admin', !state.car_admin)}}>   {t(['inviteUser','admin'])}</span>
              </p>
            </div>}
          </div>
        </div>
        </Form>
      </PageBase>
    )
  }
}


export default connect(state => {
  const { inviteUser } = state
  return ({
    state: inviteUser
  })
}, dispatch => ({
  actions: bindActionCreators(inviteUserActions, dispatch)
}))(inviteUserPage)
