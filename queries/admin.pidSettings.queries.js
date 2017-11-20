export const GET_SELECTED_TARIF = `query ($id: Id!) {
  garage(id: $id) {
    pid_tarif_id
  }
}
`
