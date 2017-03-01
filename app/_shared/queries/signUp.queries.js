<<<<<<< HEAD
// signs up new user
export const CREATE_USER_QUERY = 'mutation userMutations($user:UserInput!){create_user(user:$user){id}}'
=======
// signs up new user - has to be inline
export const CREATE_USER_QUERY = `mutation userMutations($user: UserInput!) { create_user(user: $user) { id } }`
>>>>>>> feature/new_api
