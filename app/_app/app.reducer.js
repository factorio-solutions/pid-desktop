import { combineReducers }          from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import login            from '../_shared/reducers/login.reducer'
import signUp           from '../_shared/reducers/signUp.reducer'

import pageBase         from '../_shared/reducers/pageBase.reducer'
import notifications    from '../_shared/reducers/notifications.reducer'

import newReservation   from '../_shared/reducers/newReservation.reducer'
import reservations     from '../_shared/reducers/reservations.reducer'

import garages          from '../_shared/reducers/garages.reducer'
import newGarage        from '../_shared/reducers/newGarage.reducer'
import garageClients    from '../_shared/reducers/garageClients.reducer'
import garageMarketing  from '../_shared/reducers/garageMarketing.reducer'
import newMarketing     from '../_shared/reducers/newMarketing.reducer'
import newPricing       from '../_shared/reducers/newPricing.reducer'
import newRent          from '../_shared/reducers/newRent.reducer'
import garageUsers      from '../_shared/reducers/garageUsers.reducer'

import marketing        from '../_shared/reducers/marketing.reducer'

import occupancy        from '../_shared/reducers/occupancy.reducer'

import clients          from '../_shared/reducers/clients.reducer'
import newClient        from '../_shared/reducers/newClient.reducer'
import clientUsers      from '../_shared/reducers/clientUsers.reducer'

import cars             from '../_shared/reducers/cars.reducer'
import newCar           from '../_shared/reducers/newCar.reducer'
import carUsers         from '../_shared/reducers/carUsers.reducer'

import users            from '../_shared/reducers/users.reducer'
import inviteUser       from '../_shared/reducers/inviteUser.reducer'


const rootReducer = combineReducers({ routing

                                    , login
                                    , signUp

                                    , pageBase
                                    , notifications

                                    , newReservation
                                    , reservations

                                    , garages
                                    , newGarage
                                    , garageClients
                                    , garageMarketing
                                    , newMarketing
                                    , newPricing
                                    , newRent
                                    , garageUsers

                                    , marketing

                                    , occupancy

                                    , clients
                                    , newClient
                                    , clientUsers

                                    , cars
                                    , newCar
                                    , carUsers

                                    , users
                                    , inviteUser
                                    })

export default rootReducer
