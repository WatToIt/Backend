module.exports.ResponseError = function (res, err, code) {
    let toSend = { success: 0 };
    if (code) res.statusCode = code;
    if (err.message) {
        toSend.message = err.message;
    }
    if (err.error) {
        toSend.error = err.error;
    }
    return res.json(toSend);
};

module.exports.ResponseSuccess = function (res, data, code) {
    let toSend = { success: 1 };

    if (data) {
        toSend.data = data;
    }

    if (code) res.statusCode = code;

    return res.json(toSend);
};