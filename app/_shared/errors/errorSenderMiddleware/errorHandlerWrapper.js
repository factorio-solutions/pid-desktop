import { sendError } from '../../../index'

const asyncRegex = /^async /

const asyncTraspiledRegex = /return _ref[^\.]*\.apply/

function asyncWrapper(asyncFnc) {
  return async (dispatch, getState) => {
    try {
      return await asyncFnc(dispatch, getState)
    } catch (e) {
      sendError(e)
      throw e
    }
  }
}

function syncWrapper(syncFnc) {
  return (dispatch, getState) => {
    try {
      return syncFnc(dispatch, getState)
    } catch (e) {
      sendError(e)
      throw e
    }
  }
}

export default function wrapper(fnc) {
  const fncString = fnc.toString().trim()
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Using hacky way how to detect async action. It is possible that it will require change after babel update.')
  }
  // HACK: Detecting async action by searching patterns of transpile function.
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
