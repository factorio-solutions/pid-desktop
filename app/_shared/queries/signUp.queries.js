// signs up new user
export const CREATE_USER_QUERY = 'mutation userMutations($user:UserInput!){create_user(user:$user){id}}'
