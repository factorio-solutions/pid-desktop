import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import localforage from 'localforage'
import { UAParser } from 'ua-parser-js'
import createRoutes from './routes'
import configureStore from './_store/configureStore'
import { version } from '../package.json'
import request from './_shared/helpers/requestPromise'

import './_shared/helpers/findById'
import './_shared/helpers/stringOperations'
import './_shared/styles/normalize.css'
import './_shared/styles/fonts.scss'
import './_styles/app.desktop.scss'


export const store = configureStore()
// when different actions are needed on mobile and desktop
export const mobile = false
export const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/queries'
export const adminEntryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/admin'

const parser = new UAParser()

const device = parser.getDevice()
const os = parser.getOS()
const browser = parser.getBrowser()

const platform = (
  `OS: ${os.name} ${os.version}
  browser: ${browser.name} ${browser.version}
  device:
    model: ${device.model},
    type: ${device.type},
    vendor: ${device.vendor}`
)

let lastError
export const sendError = (error, message = error.message) => {
  if (message !== lastError) {
    lastError = message
    const state = store.getState().pageBase
    request(`mutation ($origin: String!, $message: String!, $backtrace: String!, $location: String!, $user_id: Id, $version: String!, $platform: String!) {
      error (origin: $origin, message: $message, backtrace: $backtrace, location: $location, user_id: $user_id, version: $version, platform: $platform)
    }`,
    {
      origin:    'desktop_client',
      message,
      backtrace: error.stack,
      location:  window.location.href,
      user_id:   state.current_user ? state.current_user.id : undefined,
      version,
      platform
    })
  }
}


const history = syncHistoryWithStore(hashHistory, store)
// Force Monday as the first day of a week when English is set.
require('moment').updateLocale('en', {
  week: {
    dow: 1
  }
})

// exposed stuff for development
if (process.env.NODE_ENV !== 'production') {
  window.moment = require('moment')
  window.localforage = localforage
}


window.onerror = (message, source, lineno, colno, error) => {
  sendError(error, message)
}

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React, { exclude: [ /^Connect/ ] })
// }
localforage.getItem('jwt')
  .then(jwt => {
    render(
      <Provider store={store}>
        <Router history={history} routes={createRoutes(jwt)} />
      </Provider>,
      document.getElementById('root')
    )
  })
  .catch(e => {
    sendError(e)
    throw e
  })
