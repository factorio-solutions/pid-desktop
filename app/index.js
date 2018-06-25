import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createRoutes from './routes'
import configureStore from './_store/configureStore'

import './_shared/helpers/findById'
import './_shared/styles/normalize.css'
import './_shared/styles/fonts.scss'
import './_styles/app.desktop.scss'


export const store = configureStore()
export const mobile = false  // when different actions are needed on mobile and desktop
export const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/queries'
export const adminEntryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/admin'


const history = syncHistoryWithStore(hashHistory, store)

if (process.env.NODE_ENV !== 'production') { // exposed stuff for development
  window.moment = require('moment')
}

render(
  <Provider store={store}>
    <Router history={history} routes={createRoutes()} />
  </Provider>,
  document.getElementById('root')
)
