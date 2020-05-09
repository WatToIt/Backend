const pool = require("../../config/database");


const createUser = (data) => (
    pool.query(`INSERT INTO users(id, username, email, password) values (?,?,?,?)`,
        [
            data.id,
            data.username,
            data.email,
            data.password
        ]
    )
);

const isUserUnique = (username, email) => (pool.query("SELECT * FROM users WHERE username = ? OR email = ? ", [username, email]));

const getUsers = () => (pool.query(`SELECT * FROM users`));

const getUserById = (id) => (pool.query(`SELECT * FROM users WHERE id = ?`, [id]));

const getUserByUsername = (username) => (pool.query(`SELECT * FROM users WHERE username = ?`,[username]));




module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    isUserUnique
}