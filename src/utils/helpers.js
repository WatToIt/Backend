function objectValueMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

function objectKeyMap(object, mapFn) {
    return Object.keys(object).reduce(function (result, key) {
        result[mapFn(key)] = object[key]
        return result
    }, {})
}


module.exports = {
    objectValueMap,
    objectKeyMap
}