const pool = require("../../config/database");


const customCallback = (callBack, multiple) => ((error, results, fields) => {
    if (error){
        callBack(error)
    }
    if (multiple){
        return callBack(null, results);
    }
    if(results.length == 0){
        return callBack(null, {});
    }
    return callBack(null, results[0])
});



const createUser = (data, callBack) => {
    pool.query(`INSERT INTO users(id, username, email, password) values (?,?,?,?)`,
        [
            data.id,
            data.username,
            data.email,
            data.password
        ],
        (error, results, fields) => {
            if (error){
                callBack(error)
            }
            return callBack(null, results)
        }
    )
}

const getUsers = (callBack) => {
    pool.query(`SELECT * FROM users`, customCallback(callBack, true));
};

const getUserById = (id, callBack)=> {
    pool.query(`SELECT * FROM users WHERE id = '${id}'`, customCallback(callBack));
};

const getUserByUsername = (username, callBack)=> {
    pool.query(`SELECT * FROM users WHERE username = '${username}'`, customCallback(callBack));
};

const isUserUnique = (username, email, callBack) => {
    pool.query("SELECT * FROM users WHERE username = ? OR email = ? ", [username,email], customCallback(callBack));
};


module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    isUserUnique
}