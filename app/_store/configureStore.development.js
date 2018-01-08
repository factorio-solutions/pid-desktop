import { createStore, applyMiddleware, compose }  from 'redux'
import thunk                                      from 'redux-thunk'
import reduxReset                                 from 'redux-reset'
import { createLogger }                           from 'redux-logger'
import { hashHistory }                            from 'react-router'
import { routerMiddleware, push }                 from 'react-router-redux'

import rootReducer from '../_app/app.reducer'

const actionCreators = {
  push
}

const logger = createLogger({
  level:     'info',
  collapsed: true
})

const router = routerMiddleware(hashHistory)

const enhancer = compose(
  applyMiddleware(thunk, router, logger),
  reduxReset(),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    noop => noop
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store)
  }

  if (module.hot) {
    module.hot.accept('../_app/app.reducer', () =>
      store.replaceReducer(require('../_app/app.reducer')) // eslint-disable-line global-require
    )
  }

  return store
}
