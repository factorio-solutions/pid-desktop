import { createSelector } from 'reselect'

import {
  getUser,
  getName,
  getReservation,
  getAvailableUsers,
  getCurrentUser,
  getEmail,
  getPhone,
  getHighlight
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

      return props
        .filter(prop => prop)
        .map(prop => prop.toString().replace(/\s\s+/g, ' ').trim().toLowerCase())
        .some(value => value.includes(searchQuery.toLowerCase()))
    }

    return availableUsers.filter(user => {
      if (user.id < 0) return false

      return searchQueryHit(nameInput.value, user.full_name, user.email, user.phone)
    })
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

export const getComponentState = createSelector(
  [
    getUser,
    getAvailableUsers,
    getReservation,
    getName,
    getEmail,
    getPhone,
    getHighlight,
    getCurrentUser
  ],
  (user, availableUsers, reservation, name, email, phone, highlight, currentUser) => ({
    user,
    availableUsers,
    reservation,
    highlight,
    name,
    currentUser,
    email,
    phone
  })
)
