// get garage details
export const GET_MARKETING = `query ($id: Id!) {
  garage(id: $id) {
    name
    marketing{
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
      images {
        file
        tag
        img
      }
      descriptions {
        language
        text
      }
    }
  }
}
`

// create new Marketing
// export const CREATE_NEW_MARKTETING = `mutation createMarketing($marketing: MarketingInput!, $garage_id: Id!) {
//   create_marketing(marketing: $marketing, garage_id: $garage_id) {
//     id
//   }
// }
// `

// init marketing edit
// export const INIT_MARKETING = `query ($id: Id!) {
//   marketing(marketing_id: $id) {
//     camera_at_gate
//     cameras
//     charging_station
//     city_center
//     email
//     fifteen_minutes_from_center
//     five_minutes_from_center
//     five_minutes_from_subway
//     garage_id
//     gate_opened_by_phone
//     gate_opened_by_receptionist
//     historical_center
//     marketing_launched
//     non_stop_open
//     non_stop_reception
//     number_plate_recognition
//     phone
//     short_name
//     size_restriction
//     subway_nearby
//     ten_minutes_from_center
//     tram_nearby
//     wc
//     images {
//       file
//       tag
//       img
//     }
//     descriptions {
//       language
//       text
//     }
//   }
// }
// `

// init marketing edit
export const EDIT_MARKETING = `mutation editMarketing($marketing:MarketingInput!, $id:Id!){
  update_marketing(marketing: $marketing, id: $id){
    id
  }
}`
