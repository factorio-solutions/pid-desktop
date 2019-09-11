import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SearchField      from '../../../_shared/components/searchField/SearchField'
import ExistingUserForm from '../existingUserForm'
import NewUserForm      from '../newUserForm'
import SectionWithHeader from '../../../_shared/components/wrapers/SectionWithHeader'
import RoundButton       from '../../../_shared/components/buttons/RoundButton'

import {
  downloadUser,
  showLoading,
  hideLoading,
  setHostName,
  clearForm,
  cancelUser
} from '../../../_shared/actions/newReservation.actions'

import {
  getUsers,
  getButtons,
  getUserToSelect,
  getComponentState
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
    const {
      actions: { cancelUser: cancelUserAction }
    } = this.props
    cancelUserAction()
    if (this.searchField) {
      this.searchField.filter.input.focus()
    }
  }

  renderResetButton = (
    <RoundButton
      className={styles.resetButton}
      content={<span className="fa fa-times" />}
      onClick={this.cancelUser}
      type="remove"
      question="No message"
      size="small"
    />
  )

  handleDownloadUser = async (id, rights) => {
    const { actions } = this.props
    actions.showLoading()
    await actions.downloadUser(id, rights)
    actions.hideLoading()
  }

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
    const isSecretary = (
      state.reservation
      && state.reservation.client
      && state.reservation.client.client_user.secretary
    )

    return (
      <SectionWithHeader header={t([ 'newReservation', 'userSection' ])}>
        {!(state.user && (state.user.id < 0 || onetime))
        && (
          (
            state.user
            && state.currentUser
            && state.user.id !== state.currentUser.id
          )
          || state.availableUsers.length > 1
        ) && (
          <div className={styles.searchField}>
            {state.user && this.renderResetButton}
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
              separateFirst={usersDropdown.some(user => user.id === state.currentUser.id)}
              user={state.user}
              downloadUser={this.handleDownloadUser}
              key="SearchField"
            />
          </div>
        )}

        {state.user && state.user.id >= 0 && !state.user.onetime && (
          <ExistingUserForm
            editable={!ongoing || isSecretary}
            key="ExistingUserForm"
          />
        )}

        {((state.user && state.user.id < 0) || (state.user && state.user.onetime)) && (
          <NewUserForm
            editable={!ongoing || isSecretary}
            onetime={onetime}
            resetButton={this.renderResetButton}
            key="NewUserForm"
          />
        )}
        {(state.user && state.user.id === -2) && !state.email.valid && !state.phone.valid && (
          <div className={styles.fillInContact} key="infoMessage">
            {t([ 'newReservation', 'fillInContact' ])}
          </div>
        )}
      </SectionWithHeader>
    )
  }
}

const mapStateToProps = state => ({
  state:           getComponentState(state),
  usersDropdown:   getUsers(state),
  buttonsDropdown: getButtons(state),
  userToSelect:    getUserToSelect(state)
})

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(
      {
        downloadUser,
        showLoading,
        hideLoading,
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
