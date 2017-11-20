import {
  GATE_MODULE_ORDER_AMOUNT,
  GATE_MODULE_ORDER_HIGHLIGHT,
  GATE_MODULE_ORDER_EQUAL_ADDRESSES,
  GATE_MODULE_ORDER_NAME,
  GATE_MODULE_ORDER_LINE_1,
  GATE_MODULE_ORDER_LINE_2,
  GATE_MODULE_ORDER_CITY,
  GATE_MODULE_ORDER_POSTAL_CODE,
  GATE_MODULE_ORDER_STATE,
  GATE_MODULE_ORDER_COUNTRY,
  GATE_MODULE_ORDER_INVOICE_NAME,
  GATE_MODULE_ORDER_INVOICE_LINE_1,
  GATE_MODULE_ORDER_INVOICE_LINE_2,
  GATE_MODULE_ORDER_INVOICE_CITY,
  GATE_MODULE_ORDER_INVOICE_POSTAL_CODE,
  GATE_MODULE_ORDER_INVOICE_STATE,
  GATE_MODULE_ORDER_INVOICE_COUNTRY
}  from '../actions/gateModuleOrder.actions'

const emptyAddress = { name:        ""
                     , line_1:      ""
                     , line_2:      ""
                     , city:        ""
                     , postal_code: ""
                     , state:       ""
                     , country:     ""
                     }

const defaultState =  { amount:          1
                      , highlight:       false
                      , equalAddresses:  true
                      , address:         emptyAddress
                      , invoice_address: emptyAddress
                      }


export default function gateModuleOrder (state = defaultState, action) {
  switch (action.type) {

    case GATE_MODULE_ORDER_AMOUNT:
      return { ...state
             , amount: action.value
             }

    case GATE_MODULE_ORDER_HIGHLIGHT:
      return { ...state
             , highlight: action.value
             }

    case GATE_MODULE_ORDER_EQUAL_ADDRESSES:
      return { ...state
             , equalAddresses: action.value
             }

    case GATE_MODULE_ORDER_NAME:
      return { ...state
             , address: { ...state.address
                        , name: action.value
                        }
             }

    case GATE_MODULE_ORDER_LINE_1:
      return { ...state
            , address: { ...state.address
                       , line_1: action.value
                       }
             }

    case GATE_MODULE_ORDER_LINE_2:
      return { ...state
            , address: { ...state.address
                       , line_2: action.value
                       }
             }

    case GATE_MODULE_ORDER_CITY:
      return { ...state
            , address: { ...state.address
                       , city: action.value
                       }
             }

    case GATE_MODULE_ORDER_POSTAL_CODE:
      return { ...state
            , address: { ...state.address
                       , postal_code: action.value
                       }
             }

    case GATE_MODULE_ORDER_STATE:
      return { ...state
            , address: { ...state.address
                       , state: action.value
                       }
             }

    case GATE_MODULE_ORDER_COUNTRY:
      return { ...state
            , address: { ...state.address
                       , country: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_NAME:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , name: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_LINE_1:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , line_1: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_LINE_2:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , line_2: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_CITY:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , city: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_POSTAL_CODE:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , postal_code: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_STATE:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , state: action.value
                       }
             }

    case GATE_MODULE_ORDER_INVOICE_COUNTRY:
      return { ...state
            , invoice_address: { ...state.invoice_address
                       , country: action.value
                       }
             }


    default:
      return state
  }
}
