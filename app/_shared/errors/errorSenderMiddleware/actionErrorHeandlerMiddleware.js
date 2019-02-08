import wrapper from './errorHandlerWrapper'

function actionErrorMiddleware() {
  return next => action => {
    if (typeof action === 'function') {
      return next(wrapper(action))
    }
    return next(action)
  }
}

export default actionErrorMiddleware
