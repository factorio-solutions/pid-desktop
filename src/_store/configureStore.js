import { createStore, applyMiddleware, compose }  from 'redux'
import thunk                                      from 'redux-thunk';
import reduxReset                                 from 'redux-reset'
import createLogger                               from 'redux-logger'
import { hashHistory }                            from 'react-router';
import { routerMiddleware }                       from 'react-router-redux';

import rootReducer from '../_app/app.reducer'


export default initialState => {
  const router = routerMiddleware(hashHistory);
  const logger =  createLogger({ level: 'info', collapsed: true })
  const enhancer = compose(applyMiddleware(thunk, router, logger), reduxReset());

  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
