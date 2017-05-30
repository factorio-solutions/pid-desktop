import React                    from 'react'
import { render }               from 'react-dom'
import { Provider }             from 'react-redux'
import { Router, hashHistory }  from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createRoutes             from './routes'
import configureStore           from './_store/configureStore'

import './_shared/styles/normalize.css'
import './_shared/styles/fonts.scss'
import './_styles/app.desktop.scss'


export const store = configureStore()
export const mobile = false  // when different actions are needed on mobile and desktop
// export const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000')+'/queries'
export const entryPoint = ('https://park-it-direct.herokuapp.com')+'/queries'
// export const entryPoint = 'https://park-it-direct.herokuapp.com/queries'
// export const entryPoint = 'https://park-it-direct-alpha.herokuapp.com/queries'
// export const entryPoint = 'http://localhost:3000/queries'
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={createRoutes()} />
  </Provider>,
  document.getElementById('root')
);
