// opens gate of selected reservation
export const MOBILE_ACCESS_OPEN_GATE = `mutation OpenGate ($user_id:Id!, $reservation_id:Id!, $gate_id:Id!) {
  open_gate(user_id: $user_id, reservation_id: $reservation_id, gate_id: $gate_id)
}
`

export const MOBILE_ACCESS_LOG_ACCESS = `mutation CreateAccessLog($gate_access_log: GateAccessLogInput!) {
  create_gate_access_log(gate_access_log: $gate_access_log) {
    id
  }
}
`
