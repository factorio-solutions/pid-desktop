import {
  attributes,
  NEW_MARKETING_SET_GARAGE,
  NEW_MARKETING_SET_DESCRIPTIONS,
  NEW_MARKETING_SET_PARAMETER,
  NEW_MARKETING_SET_DESCRIPTION_LANGUAGE,
  NEW_MARKETING_SET_SHORT_NAME,
  NEW_MARKETING_SET_PHONE,
  NEW_MARKETING_SET_EMAIL,
  NEW_MARKETING_SET_IMAGES,
  NEW_MARKETING_SET_MODAL,
  NEW_MARKETING_SET_MODAL_ERROR,
  NEW_MARKETING_CLEAR_FORM
}  from '../actions/newMarketing.actions'

var initialState =  { garage:               undefined
                    , short_name:           {value: undefined, valid: false}
                    , phone:                {value: undefined, valid: false}
                    , email:                {value: undefined, valid: false}
                    , descriptionLanguage:  'en' // current language
                    , descriptions:         {} // en: "description text... "
                    , images:               [{tag: undefined, img: '', file: ''}] // {tag: '', img: 'base64Code'}

                    , modalContent: undefined
                    , modalError:   undefined
                    }

function addParameters(initialState, attributes) { // add attributes to initial state
  return attributes.reduce((state, attribute)=>{
    state[attribute] = false
    return state
  }, initialState)
}


export default function newMarketing (state = addParameters(initialState, attributes), action) {
  switch (action.type) {

    case NEW_MARKETING_SET_GARAGE:
      return { ...state
             , garage: action.value
             }

    case NEW_MARKETING_SET_DESCRIPTIONS:
  		return { ...state
  					 , descriptions: action.value
  				 	 }

    case NEW_MARKETING_SET_PARAMETER:
      return { ...state
             , [action.key]: action.value
             }

    case NEW_MARKETING_SET_DESCRIPTION_LANGUAGE:
      return { ...state
             , descriptionLanguage: action.value
             }

    case NEW_MARKETING_SET_SHORT_NAME:
      return { ...state
             , short_name: action.value
             }

    case NEW_MARKETING_SET_PHONE:
      return { ...state
            , phone: action.value
            }

    case NEW_MARKETING_SET_EMAIL:
      return { ...state
             , email: action.value
             }

    case NEW_MARKETING_SET_IMAGES:
      return { ...state
             , images: action.value
             }

    case NEW_MARKETING_SET_MODAL:
       return { ...state
              , modalContent: action.value
              }

    case NEW_MARKETING_SET_MODAL:
      return { ...state
             , modalContent: action.value
             }

   case NEW_MARKETING_SET_MODAL_ERROR:
     return { ...state
            , modalError: action.value
            }

     case NEW_MARKETING_CLEAR_FORM:
       return addParameters(initialState, attributes)

    default:
      return state
  }
}
