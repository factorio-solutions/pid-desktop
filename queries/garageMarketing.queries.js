// marketing page
export const GET_GARAGE_MARKETING = `query ($id: Id!) {
  garage(id: $id) {
    name
  }
  marketing(garage_id: $id) {
    id
    email
    phone
    short_name
    marketing_launched
  }
}
`

// page details
export const GET_GARAGE_MARKETING_DETAILS = `query ($id: Id!) {
  garage(id: $id) {
    name
  }
  marketing(garage_id: $id) {
    id
    camera_at_gate
    cameras
    charging_station
    city_center
    email
    fifteen_minutes_from_center
    five_minutes_from_center
    five_minutes_from_subway
    garage_id
    gate_opened_by_phone
    gate_opened_by_receptionist
    historical_center
    marketing_launched
    non_stop_open
    non_stop_reception
    number_plate_recognition
    phone
    short_name
    size_restriction
    subway_nearby
    ten_minutes_from_center
    tram_nearby
    wc
    image {
      file
      tag
      img
    }
    description {
      language
      text
    }
  }
}
`

// edit marketing
export const UPDATE_MARKETING = `mutation UpdateMarketing($id: Id!, $marketing: MarketingInput!) {
  update_marketing(id: $id, marketing: $marketing) {
    garage_id
  }
}
`
