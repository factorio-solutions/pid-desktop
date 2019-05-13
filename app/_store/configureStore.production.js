import { createStore, applyMiddleware, compose }  from 'redux'
import thunk                                      from 'redux-thunk'
import reduxReset                                 from 'redux-reset'
import { hashHistory }                            from 'react-router'
import { enableBatching }                         from 'redux-batched-actions'
import { createHashHistory }                      from 'history'
import { routerMiddleware }                       from 'connected-react-router'

import errorSender  from '../_shared/errors/errorSenderMiddleware/actionErrorHeandlerMiddleware'

import createRootReducer from '../_app/app.reducer'

export const history = createHashHistory()

const router = routerMiddleware(hashHistory)

const enhancer = compose(applyMiddleware(errorSender, thunk, router), reduxReset())

export default function configureStore(initialState) {
  return createStore(enableBatching(createRootReducer(history)), initialState, enhancer)
}
