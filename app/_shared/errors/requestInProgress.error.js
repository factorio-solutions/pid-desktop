export default class RequestInProgressError extends Error {
  // constructor(message) {
  //   const trueProto = new.target.prototype
  //   super(message)
  //   this.__proto__ = trueProto
  // }
  // It is here because bable.
  constructor(message) {
    super(message)
    Object.setPrototypeOf(this, RequestInProgressError.prototype)
  }
}
