import { createStore, applyMiddleware, compose }  from 'redux'
import thunk                                      from 'redux-thunk'
import reduxReset                                 from 'redux-reset'
import { hashHistory }                            from 'react-router'
import { enableBatching }                         from 'redux-batched-actions'
import { routerMiddleware }                       from 'react-router-redux'
import errorSender  from '../_shared/errors/errorSenderMiddleware/actionErrorHeandlerMiddleware'

import rootReducer from '../_app/app.reducer'

const router = routerMiddleware(hashHistory)

const enhancer = compose(applyMiddleware(errorSender, thunk, router), reduxReset())

export default function configureStore(initialState) {
  return createStore(enableBatching(rootReducer), initialState, enhancer)
}
