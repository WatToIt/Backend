module.exports.ResponseError = function(res, err, code){ // Error Web Response
    if(typeof err == 'object' && typeof err.message != 'undefined'){
        err = err.message;
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json({success:0, error: err});
};

module.exports.ResponseSuccess = function(res, data, code){ 
    let send_data = {success:1};

    if(typeof data == 'object'){
        send_data = Object.assign(data, send_data);
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};