// will find object in array of objects that have selected id
Array.prototype.findById = function findById(id) {
  return this.find(object => object.id === id)
}

// will find index of object with id in array of objects
Array.prototype.findIndexById = function findById(id) {
  return this.findIndex(object => object.id === id)
}
