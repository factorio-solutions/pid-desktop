// get available users for ClientUsers
export const USER_AVAILABLE = `query UserByEmail($user: UserInput!) {
  user_by_email(user: $user) {
    id
  }
}
`

// create Managebles connection
export const ADD_MANAGEBLES = `mutation UserCarMutation($user_id:Id!, $client_user: ClientUserInput, $user_garage: UserGarageInput, $user_car: UserCarInput) {
  create_client_user(user_id:$user_id, client_user: $client_user){
    id
  }
  create_user_garage(user_id:$user_id, user_garage: $user_garage){
  	id
  }
  create_user_car(user_id:$user_id, user_car: $user_car) {
    id
  }
}
`

// get manageble clients
export const INIT_MANAGEBLES = `{
  current_user {
    id
  }
  client_users {
    user_id
    admin
    secretary
    internal
    client {
      name
      id
    }
  }

  manageble_cars{
    car{
      id
      model
    }
  }
  manageble_garages{
    garage{
      id
      name
    }
  }
}
`
