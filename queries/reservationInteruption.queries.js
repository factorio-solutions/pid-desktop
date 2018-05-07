// will take selected reservation an will perform interuption in selected inteval
export const INTERUPT_RESERVATION = `mutation ReservationInteruption($id: Id, $from: Datetime, $to: Datetime){
  reservation_interuption(id: $id, from: $from, to: $to){
    id
  }
}
`
