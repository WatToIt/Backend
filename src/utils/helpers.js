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

function fold (reducer, init, xs)  {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};

module.exports = {
    objectValueMap,
    objectKeyMap,
    fold
}