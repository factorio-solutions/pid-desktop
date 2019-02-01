import request from '../helpers/request'

import { GET_KNOWN_USERS }  from '../queries/users.queries'


export const USERS_SET_USERS = 'USERS_SET_USERS'
export const USERS_SET_PENDING = 'USERS_SET_PENDING'
export const USERS_SET_FILTERS = 'USERS_SET_FILTERS'


export function setUsers(users) {
  return { type:  USERS_SET_USERS,
    value: users
  }
}

export function setPending(value) {
  return { type: USERS_SET_PENDING,
    value
  }
}

export function setFilters(value) {
  return { type: USERS_SET_FILTERS,
    value
  }
}


export function allClicked() {
  return setFilters('all')
}

export function pendingClicked() {
  return setFilters('pending')
}


export function initUsers() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const filterPending = obj => obj.pending
      const filterNotPending = obj => !obj.pending
      const addKey = (acc, user) => {
        if (!acc.hasOwnProperty(user.id)) {
          acc[user.id] = { ...user,
            clients: [],
            garages: [],
            cars:    []
          }
        }
        return acc
      }

      let users = response.data.client_users.filter(filterNotPending).reduce((acc, cu) => { // cu == clietn user
        acc = addKey(acc, cu.user)
        acc[cu.user.id].clients.push({ ...cu.client,
          admin:         cu.admin,
          secretary:     cu.secretary,
          internal:      cu.internal,
          host:          cu.host,
          contactPerson: cu.contact_person
        })
        return acc
      }, {}) // find users and their clients

      users = response.data.user_cars.filter(filterNotPending).reduce((acc, uc) => { // cu car user
        acc = addKey(acc, uc.user)
        acc[uc.user.id].cars.push({ ...uc.car,
          admin:  uc.admin,
          driver: uc.driver
        })
        return acc
      }, users)// find users and their cars

      users = response.data.user_garages.filter(filterNotPending).reduce((acc, ug) => {
        acc = addKey(acc, ug.user)
        acc[ug.user.id].garages.push({ ...ug.garage,
          admin:        ug.admin,
          receptionist: ug.secretary,
          security:     ug.internal,
          manager:      ug.manager
        })
        return acc  
      }, users)// find users and their garages

      users = Object.keys(users).map(key => users[key]) // object to array

      dispatch(setUsers(users))

      const pendingClients = response.data.client_users.filter(filterPending).map(cu => ({ ...cu.user,
        client: { ...cu.client,
          admin:     cu.admin,
          secretary: cu.secretary,
          internal:  cu.internal,
          host:      cu.host
        },
        created_at: cu.created_at
      }))

      const pendingCars = response.data.user_cars.filter(filterPending).map(uc => ({ ...uc.user,
        car: { ...uc.car,
          admin:  uc.admin,
          driver: uc.driver
        },
        created_at: uc.created_at
      }))

      const pendingGarages = response.data.user_garages.filter(filterPending).map(gu => ({ ...gu.user,
        garage: { ...gu.garage,
          admin:        gu.admin,
          receptionist: gu.secretary,
          security:     gu.security
        },
        created_at: gu.created_at
      }))

      dispatch(setPending([ ...pendingClients, ...pendingCars, ...pendingGarages ]))
    }

    request(onSuccess, GET_KNOWN_USERS)
  }
}

// function transformUsers (initArray,client_users, pending) {
//   return client_users.reduce((users, client_user)=>{
//     var index = users.findIndex((user)=>{return user.id == client_user.user.id})
//     if (index == -1) {
//       client_user.user.pending = pending
//       !pending ? client_user.user.clients = [client_user.client] : client_user.user.clients = []
//       users.push(client_user.user)
//     } else {
//       client_user.client && users[index].clients.push(client_user.client)
//     }
//
//     return users
//   }, initArray)
// }
