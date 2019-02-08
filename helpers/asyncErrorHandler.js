import request from './requestPromise'
import { version } from '../../../package.json'

const asyncRegex = /^async /

const asyncTraspiledRegex = /return _ref[^\.]*\.apply/

let lastError

export function sendError(error, getState) {
  const state = getState().pageBase
  if (error.message !== lastError) { // block error cycle
    lastError = error.message
    request(`mutation ErrorSend ($origin: String!, $message: String!, $backtrace: String!, $location: String!, $user_id: Id, $version: String!) {
      error(origin: $origin, message: $message, backtrace: $backtrace, location: $location, user_id: $user_id, version: $version)
    }`,
    {
      origin:    'desktop_client',
      message:   error.message,
      backtrace: error.stack,
      location:  window.location.href,
      user_id:   state.current_user ? state.current_user.id : undefined,
      version
    })
  }
}

function asyncWrapper(asyncFnc) {
  return async (dispatch, getState) => {
    try {
      return await asyncFnc(dispatch, getState)
    } catch (e) {
      sendError(e, getState)
      throw e
    }
  }
}

function syncWrapper(syncFnc) {
  return (dispatch, getState) => {
    try {
      return syncFnc(dispatch, getState)
    } catch (e) {
      sendError(e, getState)
      throw e
    }
  }
}

export default function wrapper(fnc) {
  const fncString = fnc.toString().trim()

  if (
    // native
    asyncRegex.test(fncString)
    // babel (this may change, but hey...)
    || asyncTraspiledRegex.test(fncString)
  ) {
    return asyncWrapper(fnc)
  } else {
    return syncWrapper(fnc)
  }
}
