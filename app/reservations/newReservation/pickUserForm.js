import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import SearchField      from '../../_shared/components/searchField/SearchField'
import ExistingUserForm from './existingUserForm'
import NewUserForm      from './newUserForm'
import SectionWithHeader from '../../_shared/components/wrapers/SectionWithHeader'

import {
  downloadUser,
  setHostName
} from '../../_shared/actions/newReservation.actions'

import { t } from '../../_shared/modules/localization/localization'

import styles from '../newReservation.page.scss'


class PickUserForm extends Component {
  static propTypes = {
    state:     PropTypes.object,
    actions:   PropTypes.object,
    pageBase:  PropTypes.object,
    clearForm: PropTypes.func
  }

  getUserToSelect = userDropdown => {
    const { state } = this.props
    if (state.reservation && state.reservation.onetime) {
      return state.availableUsers.findIndex(user => user.id === -2)
    } else if (state.reservation && state.user) {
      return state.availableUsers.findIndexById(state.user.id)
    } else if (state.user && state.user.id === -1) {
      return userDropdown.users.findIndex(user => state.user && user.id === state.user.id && user.rights && JSON.stringify(user.rights) === JSON.stringify(state.user.rights))
    } else {
      return userDropdown.users.findIndex(user => state.user && user.id === state.user.id)
    }
  }

  userDropdown = () => {
    const makeButton = (user, label, text) => {
      return {
        label,
        text:    [ <b>{user.full_name}</b>, ' ', text ],
        onClick: () => this.props.actions.downloadUser(user.id, user.rights)
      }
    }

    const buttons = []
    const users = this.props.state.availableUsers.reduce((acc, user) => {
      if (user.id < 0) {
        let roleName = ''
        if (user.id === -1) {
          if (user.rights && user.rights.internal) {
            roleName = 'newInternal'
          } else {
            roleName = 'newHost'
          }
        } else {
          roleName = 'onetimeVisit'
        }
        buttons.push(makeButton(user, [ <b>{user.full_name}</b> ], t([ 'newReservation', `${roleName}Text` ])))
      } else {
        acc.push({
          id:      user.id,
          label:   user.full_name,
          phone:   user.phone,
          email:   user.email,
          order:   user.id === this.props.pageBase.current_user.id ? 1 : undefined,
          onClick: () => {
            const { state } = this.props
            if (state.user === undefined || state.user.id !== user.id) {
              this.props.actions.downloadUser(user.id, user.rights)
            }
          }
        })
      }
      return acc
    }, [])
    return { users, buttons }
  }

  render() {
    const { state, actions, pageBase, clearForm } = this.props

    const userDropdown = this.userDropdown()
    const ongoing = state.reservation && state.reservation.ongoing
    const onetime = state.reservation && state.reservation.onetime
    const isSecretary = state.reservation && state.reservation.client && state.reservation.client.client_user.secretary

    return (
      <SectionWithHeader header={t([ 'newReservation', 'userSection' ])}>
        { !(state.user && (state.user.id < 0 || onetime)) &&
          ((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
          <div className={styles.searchField}>
            <span
              className={styles.resetButton}
              onClick={clearForm}
              role="button"
              tabIndex={0}
            >
              <i className="fa fa-times-circle" aria-hidden="true" />
            </span>
            <SearchField
              editable={!ongoing || isSecretary}
              placeholder={t([ 'newReservation', 'selectUser' ]) + ' *'}
              dropdownContent={userDropdown.users}
              selected={() => this.getUserToSelect(userDropdown)}
              highlight={state.highlight}
              searchQuery={state.name.value}
              onChange={actions.setHostName}
              buttons={userDropdown.buttons}
              ref={component => this.searchField = component}
              separateFirst={userDropdown.users.some(user => user.id === pageBase.current_user.id)}
            />
          </div>
        }

        {state.user && state.user.id >= 0 &&
          <ExistingUserForm
            editable={!ongoing || isSecretary}
          />
        }

        {((state.user && state.user.id < 0) || (state.user && state.user.onetime)) &&
          <NewUserForm
            editable={!ongoing || isSecretary}
            onetime={onetime}
            clearForm={clearForm}
          />
        }
        {(state.user && state.user.id === -2) && !state.email.valid && !state.phone.valid &&
          <div className={styles.fillInContact}>
            {t([ 'newReservation', 'fillInContact' ])}
          </div>
        }
      </SectionWithHeader>
    )
  }
}

export default connect(
  state => ({ state: state.newReservation, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ downloadUser, setHostName }, dispatch) })
)(PickUserForm)
