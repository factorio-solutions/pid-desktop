// page details // marketing has to be on the same row as query
export const GET_GARAGE_MARKETING_DETAILS = `query ($short_name: String!) { marketing(short_name: $short_name) {
    id
    camera_at_gate
    cameras
    charging_station
    city_center
    email
    fifteen_minutes_from_center
    garage_id
    gate_opened_by_phone
    gate_opened_by_receptionist
    historical_center
    marketing_launched
    non_stop_open
    non_stop_reception
    phone
    short_name
    size_restriction
    tram_nearby
    wc
    guarded_parking
    car_wash
    airport_nearby
    images {
      tag
      img
    }
    descriptions {
      language
      text
    }
    garage {
      address{
        lat
        lng
        line_1
        line_2
        city
        postal_code
        state
        country
      }
      name
      place_count
    }
  }
}
`
