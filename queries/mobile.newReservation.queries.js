// get available floors, mobile purposes
export const GET_AVAILABLE_FLOORS = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!) {
  garage(id: $id) {
    floors {
      label
      free_places(begins_at: $begins_at, ends_at: $ends_at) {
        id
        label
      }
    }
  }
}
`
