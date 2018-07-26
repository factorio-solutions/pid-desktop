// Capitalize the first letter of a String
String.prototype.firstToUpperCase = function firstToUpperCase() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
