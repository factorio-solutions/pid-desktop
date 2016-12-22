// get accounts and current garage layout
export const GET_GARAGE_ACCOUNT = 'query ($id: Id!, $valid_from: Datetime!, $invalid_from: Datetime!) { garage(id: $id) { id, name, floors { label, scheme, places { label, id, account_places_interval(valid_from: $valid_from, invalid_from: $invalid_from) { account_id } } } } manageble_accounts { name, id, created_at } }'

// update garage afther update
export const GET_GARAGE_ACCOUNT_UPDATE = 'query ($id: Id!) { garage(id: $id) { id, name, floors { label, scheme, places { label, id, account_places { account_id } } } } }'

// create place account connection
export const CREATE_GARAGE_ACCOUNT = 'mutation accountPlaceMutation($place_id: Id!, $account_id: Id!, $account_place: AccountPlaceInput!) { create_account_place(place_id: $place_id, account_id: $account_id, account_place: $account_place) { account_id, place_id } }'

// destroy place account connection
// export const REMOVE_GARAGE_ACCOUNT = 'mutation accountPlaceMutation($place_id: Id!, $account_id: Id!) { destroy_account_place(place_id: $place_id, account_id: $account_id) { account_id, place_id } }'
export const REMOVE_GARAGE_ACCOUNT = 'mutation UpdateAccountPlace ($account_place: AccountPlaceInput!, $place_id: Id!, $account_id: Id!,) { update_account_place(account_place: $account_place, place_id: $place_id, account_id: $account_id){ place_id, account_id } }'
