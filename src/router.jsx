import React, { Component, PropTypes }             from 'react'
import { Router, Route, hashHistory, IndexRoute }  from 'react-router'
import { connect }                                 from 'react-redux'
import { bindActionCreators }                      from 'redux'

import * as paths from './_resources/constants/RouterPaths'

// Pages
import SignUpPage                 from './users/signUp.page'
import Login                      from './users/login.page'
import MenuPage                   from './menu/menu.page'

import AccessPage                 from './menu/access.page'

import ReservationsPage           from './reservations/reservations.page'
import ReservationPage            from './reservations/reservation.page'
import NewReservationPage         from './reservations/newReservation.page'
import NewReservationBeginsPage   from './reservations/newReservationBegins.page'
import NewReservationDurationPage from './reservations/newReservationDuration.page'
import NewReservationPlacesPage   from './reservations/newReservationPlaces.page'


export default function createRoutes() {
  const redirecToMenu = (nextState, replace) => {
    replace(paths.MENU)
  }

  const handleRedirect = (nextState, replace) => {
    localStorage['jwt'] == undefined && replace(paths.LOGIN)
  }

  return (
    <Route>
      <Route path={paths.MAIN}>
        <IndexRoute onEnter={redirecToMenu}/>

        <Route path={paths.LOGIN}                    component={Login}/>
        <Route path={paths.REGISTRATION}             component={SignUpPage}/>
        <Route path={paths.MENU}                     component={MenuPage}                   onEnter={handleRedirect}/>

        <Route path={paths.ACCESS}                   component={AccessPage}                 onEnter={handleRedirect}/>

        <Route path={paths.RESERVATIONS}             component={ReservationsPage}           onEnter={handleRedirect}/>
        <Route path={`${paths.RESERVATION_GET}/:id`} component={ReservationPage}            onEnter={handleRedirect}/>
        <Route path={paths.RESERVATION_ADD}          component={NewReservationPage}         onEnter={handleRedirect}/>
        <Route path={paths.RESERVATION_ADD_BEGINS}   component={NewReservationBeginsPage}   onEnter={handleRedirect}/>
        <Route path={paths.RESERVATION_ADD_DURATION} component={NewReservationDurationPage} onEnter={handleRedirect}/>
        <Route path={paths.RESERVATION_ADD_PLACES}   component={NewReservationPlacesPage}   onEnter={handleRedirect}/>
      </Route>

      <Route path="*" onEnter={redirecToMenu}/>
    </Route>
  )
}
