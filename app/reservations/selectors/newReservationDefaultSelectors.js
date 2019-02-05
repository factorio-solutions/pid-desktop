export const getUser = state => state.newReservation.user
export const getEmail = state => state.newReservation.email
export const getPhone = state => state.newReservation.phone
export const getName = state => state.newReservation.name
export const getClientId = state => state.newReservation.client_id
export const getFrom = state => state.newReservation.from
export const getTo = state => state.newReservation.to
export const getPaidByHost = state => state.newReservation.paidByHost
export const getTemplateText = state => state.newReservation.templateText
export const getGarage = state => state.newReservation.garage
export const getTimeCreditPrice = state => state.newReservation.timeCreditPrice
export const getSendSMS = state => state.newReservation.sendSMS
export const getPlaceId = state => state.newReservation.place_id
export const getReservation = state => state.newReservation.reservation
export const getAvailableUsers = state => state.newReservation.availableUsers
export const getCurrentUser = state => state.pageBase.current_user

export const getDownloadUserAction = (_, props) => props.actions ? props.actions.downloadUser : undefined
