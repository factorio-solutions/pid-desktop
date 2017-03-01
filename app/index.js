import React                    from 'react'
import { render }               from 'react-dom'
import { Provider }             from 'react-redux'
import { Router, hashHistory }  from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createRoutes             from './routes'
import configureStore           from './_store/configureStore'

<<<<<<< HEAD
=======
import './_shared/styles/normalize.css'
import './_shared/styles/fonts.scss'
>>>>>>> feature/new_api
import './_styles/app.desktop.scss'


export const store = configureStore()
export const mobile = false  // when different actions are needed on mobile and desktop
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={createRoutes()} />
  </Provider>,
  document.getElementById('root')
);
