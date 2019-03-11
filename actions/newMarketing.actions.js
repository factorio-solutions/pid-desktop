import update         from 'immutability-helper'
import request    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { t }          from '../modules/localization/localization'
import { toGarages }  from './pageBase.actions'

import { GET_MARKETING, EDIT_MARKETING } from '../queries/newMarketing.queries'

export const NEW_MARKETING_SET_GARAGE = 'NEW_MARKETING_SET_GARAGE'
export const NEW_MARKETING_SET_MARKETING_ID = 'NEW_MARKETING_SET_MARKETING_ID'
export const NEW_MARKETING_SET_DESCRIPTIONS = 'NEW_MARKETING_SET_DESCRIPTIONS'
export const NEW_MARKETING_SET_PARAMETER = 'NEW_MARKETING_SET_PARAMETER'
export const NEW_MARKETING_SET_DESCRIPTION_LANGUAGE = 'NEW_MARKETING_SET_DESCRIPTION_LANGUAGE'
export const NEW_MARKETING_SET_SHORT_NAME = 'NEW_MARKETING_SET_SHORT_NAME'
export const NEW_MARKETING_SET_PHONE = 'NEW_MARKETING_SET_PHONE'
export const NEW_MARKETING_SET_EMAIL = 'NEW_MARKETING_SET_EMAIL'
export const NEW_MARKETING_SET_IMAGES = 'NEW_MARKETING_SET_IMAGES'
export const NEW_MARKETING_SET_MODAL = 'NEW_MARKETING_SET_MODAL'
export const NEW_MARKETING_CLEAR_FORM = 'NEW_MARKETING_CLEAR_FORM'
export const NEW_MARKETING_SET_MODAL_ERROR = 'NEW_MARKETING_SET_MODAL_ERROR'
export const NEW_MARKETING_SET_HIGHLIGHT = 'NEW_MARKETING_SET_HIGHLIGHT'

export const attributes = [ // informative attributes - same tags are on server side
  'size_restriction',
  'non_stop_open',
  'non_stop_reception',
  'gate_opened_by_phone',
  'gate_opened_by_receptionist',
  'historical_center',
  'city_center',
  // 'five_minutes_from_center',
  // 'ten_minutes_from_center',
  'fifteen_minutes_from_center',
  'cameras',
  'camera_at_gate',
  'tram_nearby',
  // 'subway_nearby',
  'wc',
  // 'five_minutes_from_subway',
  // 'number_plate_recognition',
  'charging_station',
  'guarded_parking',
  'car_wash',
  'airport_nearby'
]

export const imageTags = [ // image tags
  'garage',
  'place',
  'gate',
  'building',
  'map'
]


export function setGarage(garage) {
  return { type:  NEW_MARKETING_SET_GARAGE,
    value: garage
  }
}

export function setMarketingId(id) {
  return { type:  NEW_MARKETING_SET_MARKETING_ID,
    value: id
  }
}

export function setDescription(descriptions) {
  return { type:  NEW_MARKETING_SET_DESCRIPTIONS,
    value: descriptions
  }
}

export function setParameter(key, value) {
  return { type: NEW_MARKETING_SET_PARAMETER,
    key,
    value
  }
}

export function setLanguage(language) {
  return { type:  NEW_MARKETING_SET_DESCRIPTION_LANGUAGE,
    value: language
  }
}

export function setShortName(name, valid) {
  return { type:  NEW_MARKETING_SET_SHORT_NAME,
    value: { value: name, valid }
  }
}

export function setPhone(phone, valid) {
  return { type:  NEW_MARKETING_SET_PHONE,
    value: { value: phone, valid }
  }
}

export function setEmail(email, valid) {
  return { type:  NEW_MARKETING_SET_EMAIL,
    value: { value: email, valid }
  }
}

export function setImages(images) {
  return { type:  NEW_MARKETING_SET_IMAGES,
    value: images
  }
}

export function setModal(modal) {
  return { type:  NEW_MARKETING_SET_MODAL,
    value: modal
  }
}

export function setModalError(error) {
  return { type:  NEW_MARKETING_SET_MODAL_ERROR,
    value: error
  }
}

export function setHighlight(value) {
  return { type: NEW_MARKETING_SET_HIGHLIGHT,
    value
  }
}

export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newMarketing.highlight))
  }
}

export function clearForm() {
  return { type: NEW_MARKETING_CLEAR_FORM }
}


export function initMarketing() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setGarage(response.data.garage))
      dispatch(setMarketingId(response.data.garage.marketing.id))
      dispatch(setShortName(response.data.garage.marketing.short_name, true))
      dispatch(setPhone(response.data.garage.marketing.phone, true))
      dispatch(setEmail(response.data.garage.marketing.email, true))
      attributes.forEach(attr => {
        dispatch(setParameter(attr, response.data.garage.marketing[attr]))
      })
      dispatch(setDescription(response.data.garage.marketing.descriptions.reduce((descriptions, desc) => {
        descriptions[desc.language] = desc.text
        return descriptions
      }, {})))
      dispatch(setImages(insertEmptyRow(response.data.garage.marketing.images)))
    }

    request(onSuccess, GET_MARKETING, { id: getState().pageBase.garage })
  }
}

// export function initMarketing(id) {
//   return (dispatch, getState) => {
//     const onSuccess = (response) => {
//       dispatch(setShortName (response.data.marketing[0].short_name, true))
//       dispatch(setPhone (response.data.marketing[0].phone, true))
//       dispatch(setEmail (response.data.marketing[0].email, true))
//       attributes.forEach((attr) => {
//         dispatch(setParameter (attr, response.data.marketing[0][attr]))
//       })
//       dispatch(setDescription(response.data.marketing[0].descriptions.reduce((descriptions, desc) => {
//         descriptions[desc.language] = desc.text
//         return descriptions
//       }, {})))
//       dispatch(setImages(insertEmptyRow(response.data.marketing[0].images)))
//     }
//
//     request(onSuccess, INIT_MARKETING, {id: parseInt(id)})
//   }
// }

export function descriptionChange(value) {
  return (dispatch, getState) => {
    const state = getState().newMarketing
    dispatch(setDescription({ ...state.descriptions, [state.descriptionLanguage]: value }))
  }
}

export function removeImage(index) {
  return (dispatch, getState) => {
    dispatch(setImages(update(getState().newMarketing.images, { $splice: [ [ index, 1 ] ] })))
  }
}

export function setTag(value, index) {
  return (dispatch, getState) => {
    dispatch(changeImages('tag', value, index))
  }
}

export function setImage(value, index) {
  return (dispatch, getState) => {
    dispatch(changeImages('img', value, index))
  }
}

function changeImages(name, value, index) {
  return (dispatch, getState) => {
    const images = getState().newMarketing.images
    const newImage = update(images[index], { [name]: { $set: value } })
    let newData = update(images, { $splice: [ [ index, 1, newImage ] ] })

    newData = insertEmptyRow(newData)
    dispatch(setImages(newData))
  }
}

function insertEmptyRow(data) {
  if (data.length == 0 || data[data.length - 1].tag != undefined || data[data.length - 1].img != '') {
    data.push({ tag: undefined, img: '' })
  }
  return data
}

export function editGarageMarketing() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.update_marketing == null) {
        // not updated - probably existing name
        dispatch(setModal(undefined))
        dispatch(setModalError(t([ 'newMarketing', 'notUpdated' ])))
      } else {
        // marketing updated
        dispatch(setModal(undefined))
        // dispatch(clearForm())

        // nav.to(`/${getState().pageBase.garage}/admin/modules`)
      }
    }

    request(onSuccess, EDIT_MARKETING,
      { id:        getState().newMarketing.marketing_id,
        marketing: marketingObject(getState().newMarketing)
      }
    )
  }
}


// private functions
function marketingObject(state) { // creates MarketingInputType object for the request
  return attributes.reduce(
    (properties, attribute) => {
      properties[attribute] = state[attribute]
      return properties
    },
    { short_name:   state.short_name.value,
      phone:        state.phone.value.replace(/\s/g, ''),
      email:        state.email.value,
      descriptions: marketingDescriptions(state),
      images:       state.images.filter((img, index, arr) => { return index != arr.length - 1 })
    }
  )
}

function marketingDescriptions(state) {
  return Object.keys(state.descriptions).reduce(
    (descs, key) => {
      descs.push({ language: key, text: state.descriptions[key] })
      return descs
    }, []
  )
}
