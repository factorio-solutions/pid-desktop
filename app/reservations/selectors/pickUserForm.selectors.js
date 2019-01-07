import React              from 'react'
import { createSelector } from 'reselect'
import { t }              from '../../_shared/modules/localization/localization'

import {
  getUser,
  getName,
  getReservation,
  getAvailableUsers,
  getCurrentUser
} from './newReservationDefaultSelectors'

const getSortedAvailableUsers = createSelector(
  getAvailableUsers, getCurrentUser,
  (availableUsers, currentUser) => {
    return availableUsers
      .map(user => ({ ...user, order: currentUser.id === user.id ? 1 : undefined }))
      .sort((a, b) => {
        if (a.order || b.order) { // sort by order
          const aOrder = a.order || Infinity
          const bOrder = b.order || Infinity
          return aOrder - bOrder
        } else { // sort by full_name
          const aLabel = (a.full_name.toString() || '').toLowerCase()
          const bLabel = (b.full_name.toString() || '').toLowerCase()

          if (aLabel < bLabel) {
            return -1
          } else if (aLabel > bLabel) {
            return 1
          } else {
            return 0
          }
        }
      })
  }
)

export const getButtons = createSelector(
  getAvailableUsers,
  availableUsers => availableUsers.filter(u => u.id < 0)
)

export const getUsers = createSelector(
  [ getSortedAvailableUsers, getName ],
  (availableUsers, nameInput) => {
    const searchQueryHit = (searchQuery, ...props) => {
      if (searchQuery === '') return true

      const valuesToCompare = props.map(prop => prop.toString().replace(/\s\s+/g, ' ').trim().toLowerCase())

      return valuesToCompare.some(value => value.includes(searchQuery.toLowerCase()))
    }

    return availableUsers.filter(
      user => user.id > 0 &&
           searchQueryHit(nameInput.value, user.full_name, user.email, user.phone)
    )
  }
)

export const getUserToSelect = createSelector(
  [ getReservation, getAvailableUsers, getUser, getUsers ],
  (reservation, availableUsers, user, usersDropdown) => {
    if (reservation && reservation.onetime) {
      return availableUsers.findIndex(u => u.id === -2)
    } else if (reservation && user) {
      return availableUsers.findIndexById(user.id)
    } else if (user && user.id === -1) {
      return usersDropdown.findIndex(u => user && u.id === user.id && u.rights && JSON.stringify(u.rights) === JSON.stringify(user.rights))
    } else {
      return usersDropdown.findIndex(u => user && u.id === user.id)
    }
  }
)
