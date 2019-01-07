import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import SearchField      from '../../../_shared/components/searchField/SearchField'
import ExistingUserForm from '../existingUserForm'
import NewUserForm      from '../newUserForm'
import SectionWithHeader from '../../../_shared/components/wrapers/SectionWithHeader'
import RoundButton       from '../../../_shared/components/buttons/RoundButton'

import {
  downloadUser,
  setHostName,
  clearForm,
  cancelUser
} from '../../../_shared/actions/newReservation.actions'

import {
  getUsers,
  getButtons,
  getUserToSelect
} from '../../selectors/pickUserForm.selectors'

import { t } from '../../../_shared/modules/localization/localization'

import styles from '../../newReservation.page.scss'


class PickUserForm extends Component {
  static propTypes = {
    state:           PropTypes.object,
    actions:         PropTypes.object,
    buttonsDropdown: PropTypes.array,
    usersDropdown:   PropTypes.array,
    userToSelect:    PropTypes.number
  }

  cancelUser = () => {
    this.props.actions.cancelUser()
    if (this.searchField) {
      // HACK: Is not focus when call immediately.
      setTimeout(() => {
        this.searchField.filter.input.focus()
        this.searchField.filter.input.select()
      }, 0)
    }
  }

  resetButton = (
    <RoundButton
      className={styles.resetButton}
      content={<span className={'fa fa-times'} />}
      onClick={this.cancelUser}
      type="remove"
      question="No message"
      size="small"
    />
  )

  render() {
    const {
      state,
      actions,
      usersDropdown,
      buttonsDropdown,
      userToSelect
    } = this.props

    const ongoing = state.reservation && state.reservation.ongoing
    const onetime = state.reservation && state.reservation.onetime
    const isSecretary = state.reservation && state.reservation.client && state.reservation.client.client_user.secretary

    return (
      <SectionWithHeader header={t([ 'newReservation', 'userSection' ])}>
        { !(state.user && (state.user.id < 0 || onetime)) &&
          ((state.user && state.current_user && state.user.id !== state.current_user.id) || state.availableUsers.length > 1) &&
          <div className={styles.searchField}>
            {state.user && this.resetButton}
            <SearchField
              editable={!ongoing || isSecretary}
              placeholder={t([ 'newReservation', 'selectUser' ]) + ' *'}
              dropdownContent={usersDropdown}
              selected={userToSelect}
              highlight={state.highlight}
              searchQuery={state.name.value}
              onChange={actions.setHostName}
              buttons={buttonsDropdown}
              ref={component => this.searchField = component}
              separateFirst={usersDropdown.some(user => user.id === state.current_user.id)}
              user={state.user}
              downloadUser={actions.downloadUser}
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
            resetButton={this.resetButton}
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

const mapStateToProps = state => {
  const {
    user,
    availableUsers,
    reservation,
    highlight,
    name
  } = state.newReservation
  const { current_user } = state.pageBase

  return {
    state: {
      user,
      availableUsers,
      reservation,
      highlight,
      name,
      current_user
    },
    usersDropdown:   getUsers(state),
    buttonsDropdown: getButtons(state),
    userToSelect:    getUserToSelect(state)
  }
}

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(
      {
        downloadUser,
        setHostName,
        clearForm,
        cancelUser
      },
      dispatch
    )
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PickUserForm)
