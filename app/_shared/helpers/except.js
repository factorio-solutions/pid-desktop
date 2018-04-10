const except = (object, keys) => Object.keys(object).reduce((acc, key) => keys.includes(key) ? acc : { ...acc, [key]: object[key] }, {})
export default except
