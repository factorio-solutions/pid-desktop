import { createStore, applyMiddleware, compose }  from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk                                      from 'redux-thunk'
import reduxReset                                 from 'redux-reset'
import { createLogger }                           from 'redux-logger'
import { hashHistory }                            from 'react-router'
import { routerMiddleware, push }                 from 'react-router-redux'
import { enableBatching }                         from 'redux-batched-actions'
import errorSender  from '../_shared/errors/errorSenderMiddleware/actionErrorHeandlerMiddleware'

import rootReducer from '../_app/app.reducer'

const actionCreators = {
  push
}

const logger = createLogger({
  level:     'info',
  collapsed: true
})

const router = routerMiddleware(hashHistory)

const enhancer = composeWithDevTools({
  trace: true
})(
  applyMiddleware(errorSender, thunk, router, logger),
  reduxReset()
)

export default function configureStore(initialState) {
  const store = createStore(enableBatching(rootReducer), initialState, enhancer)

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store)
  }

  if (module.hot) {
    module.hot.accept('../_app/app.reducer', () => store.replaceReducer(require('../_app/app.reducer')) // eslint-disable-line global-require
    )
  }

  return store
}
