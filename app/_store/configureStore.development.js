import { createStore, applyMiddleware }  from 'redux'
import { composeWithDevTools }                    from 'redux-devtools-extension'
import thunk                                      from 'redux-thunk'
import reduxReset                                 from 'redux-reset'
import { createLogger }                           from 'redux-logger'
import { routerMiddleware }                       from 'connected-react-router'
import { createHashHistory }                      from 'history'
import { enableBatching }                         from 'redux-batched-actions'
import errorSender  from '../_shared/errors/errorSenderMiddleware/actionErrorHeandlerMiddleware'

import createRootReducer from '../_app/app.reducer'

// const actionCreators = {
//   push
// }

export const history = createHashHistory()
const logger = createLogger({
  level:     'info',
  collapsed: true
})

const router = routerMiddleware(history)

const enhancer = composeWithDevTools({
  trace: true
})(
  applyMiddleware(errorSender, thunk, router, logger),
  reduxReset()
)

export default function configureStore(initialState) {
  const store = createStore(enableBatching(createRootReducer(history)), initialState, enhancer)

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store)
  }

  if (module.hot) {
    module.hot.accept(
      '../_app/app.reducer', () => store.replaceReducer(require('../_app/app.reducer')) // eslint-disable-line global-require
    )
  }

  return store
}
