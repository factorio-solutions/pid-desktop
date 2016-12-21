import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Dropdown     from '../_shared/components/dropdown/Dropdown'
import Form         from '../_shared/components/form/Form'
import PatternInput from '../_shared/components/input/PatternInput'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as inviteUserActions from '../_shared/actions/inviteUser.actions'

import styles from './inviteUser.page.scss'


export class inviteUserPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initAccounts()
  }

  render() {
    const {state, actions} = this.props

    const submitForm = () => {
      checkSubmitable() && actions.createNewAccountUser()
    }

    const goBack = () => {
      nav.back()
    }

    const checkSubmitable = () => {
      return state.email.valid && state.account_id != undefined
    }

    const emailChanged = (value, valid) => {
      actions.setEmail({ value, valid })
    }
    const messageChanged = (value, valid) => {
      actions.setMessage(value)
    }
    const nameChanged = (value, valid) => {
      actions.setName(value)
    }
    const phoneChanged = (value, valid) => {
      actions.setPhone(value)
    }
    const canManageClick          = () => {actions.setCanManage(!state.can_manage)}
    const canCreateOwnClick       = () => {actions.setCanCreateOwn(!state.can_create_own)}
    const canCreateInternalClick  = () => {actions.setCanCreateInternal(!state.can_create_internal)}
    const isInternalClick         = () => {actions.setIsInternal(!state.is_internal)}
    const internalClick           = () => {actions.setInternal()}
    const secretaryClick          = () => {actions.setSecretary()}

    const modalClick = () => {
      actions.dismissModal()
      goBack()
    }

    const successClick = () => {
      actions.dismissModal()
      goBack()
    }

    const accountDropdown = () => {
      const accountSelected = (index) => {
        actions.setAccount(state.accounts[index].id)
      }
      return state.accounts.map((account, index) => {return {label: account.name, onClick: accountSelected.bind(this, index) }})
    }

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

    const content = <div>
                      <Modal content={errorContent} show={state.error!=undefined} />
                      <Modal content={successContent} show={state.success!=undefined} />
                      <Modal content={loadingContent} show={state.currentEmail!=undefined} />

                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                      <div className={styles.form}>
                        <div className={`${styles.formChild} ${styles.mainInfo}`}>
                          <PatternInput onEnter={submitForm} onChange={emailChanged} label={t(['inviteUser', 'selectUser'])} error={t(['signup_page', 'emailInvalid'])} pattern="^([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3},*[\W]*)+$" value={state.email.value} />
                          <Dropdown label={t(['occupancy', 'selectClientAccount'])} content={accountDropdown()} style='light' selected={state.accounts.findIndex((account)=>{return account.id == state.account_id})}/>
                          <PatternInput onEnter={submitForm} onChange={messageChanged} label={t(['inviteUser', 'inviteMessage'])} error={t(['inviteUser', 'wrongMessage'])} pattern="^(?!\s*$).+" value={state.message} />
                        </div>
                        <div className={`${styles.formChild} ${styles.additionalInfo}`}>
                          <h3>{t(['inviteUser', 'optionalSettings'])}</h3>
                          <p>{t(['inviteUser', 'optionalSettingsText'])}</p>
                          <PatternInput onEnter={submitForm} onChange={nameChanged} label={t(['inviteUser', 'nameLabel'])} error={t(['signup_page', 'nameInvalid'])} pattern="^(?!\s*$).+" value={state.full_name} />
                          <PatternInput onEnter={submitForm} onChange={phoneChanged} label={t(['inviteUser', 'phoneLabel'])} error={t(['signup_page', 'phoneInvalid'])} pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" value={state.phone} />
                          <p className={styles.rights}>
                            <span className={state.can_manage ? styles.boldText : styles.inactiveText}  onClick={canManageClick}>{t(['accountUsers','isAdmin'])}</span>|
                            <span className={state.can_create_own ? styles.boldText : styles.inactiveText} onClick={canCreateOwnClick}>{t(['accountUsers','canCreateOwn'])}</span>|
                            <span className={state.can_create_internal ? styles.boldText : styles.inactiveText} onClick={canCreateInternalClick}>{t(['accountUsers','canCreateInternal'])}</span>|
                            <span className={state.is_internal ? styles.boldText : styles.inactiveText} onClick={isInternalClick}>{t(['accountUsers','isInternal'])}</span>
                          </p>
                          <div className={styles.presets}>
                            {t(['accountUsers','presetAs']) }
                            <span className={styles.clickable} onClick={internalClick}>{t(['accountUsers','internal'])}</span>|
                            <span className={styles.clickable} onClick={secretaryClick}>{t(['accountUsers','secretary'])}</span>
                          </div>
                        </div>
                      </div>

                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
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
