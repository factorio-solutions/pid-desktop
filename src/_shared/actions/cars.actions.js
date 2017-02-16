import { request } from '../helpers/request'
import _           from 'lodash'

import { GET_CARS, DESTROY_CAR } from '../queries/cars.queries'

export const CARS_SET_CARS = "CARS_SET_CARS"


export function setCars (cars){
  return  { type: CARS_SET_CARS
          , value: cars
          }
}


export function initCars (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setCars(response.data.user_cars.map((userCar) => { return { ...userCar.car, admin: userCar.admin } })))
    }
    request(onSuccess, GET_CARS)
  }
}

export function destroyCar(id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initCars())
    }
    request(onSuccess, DESTROY_CAR, {id: parseInt(id)})
  }
}
