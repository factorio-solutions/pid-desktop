import React          from 'react';
import ReactDOM       from 'react-dom';
import { Provider }   from 'react-redux';

import { Router, hashHistory }  from 'react-router';
import createRoutes             from './router.jsx'
import configureStore           from './_store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

// application styles
import './_resources/fonts/import-fonts.scss'
import 'font-awesome/css/font-awesome.css'
import './_shared/styles/fonts.scss'
import './_styles/app.mobile.scss'


export const store = configureStore(localStorage['store'] && JSON.parse(localStorage['store'])); // set Initial state if exists
export const mobile = true

const history = syncHistoryWithStore(hashHistory, store);

// document.addEventListener("offline", () => {store.dispatch({ type: 'MOBIE_MENU_SET_DEVICE_ONLINE', value: false})}, false);
// document.addEventListener("online", () => {store.dispatch({ type: 'MOBIE_MENU_SET_DEVICE_ONLINE', value: true})}, false);
store.dispatch({ type: 'MOBIE_MENU_SET_DEVICE_ONLINE', value: true})

store.subscribe(() => { // continouous save to storage
  localStorage['store'] = JSON.stringify(store.getState())
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={createRoutes()} />
  </Provider>,
  document.getElementById('app')
);
