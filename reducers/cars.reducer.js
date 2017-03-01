import { CARS_SET_CARS }  from '../actions/cars.actions'

const defaultState =  { cars: [] }


export default function cars (state = defaultState, action) {
  switch (action.type) {

    case CARS_SET_CARS:
    return  { ...state
            , cars: action.value
            }

    default:
      return state
  }
}
