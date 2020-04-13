const userService = require("./user.service");
const { ResponseSuccess, ResponseError } = require("../../utils/response");
const uuid = require("uuid");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const createUser = async (req, res) => {
    const body = req.body;
    userService.isUserUnique(body.username, body.email,
        (err1, res1) => {
            if(err1){
                return res.status(500).json({
                    success: 0,
                    message: "Database error"
                });
            }
            if (Object.keys(res1).length > 0) {
                return ResponseError(res, {
                    message: "User with such email or username exists"
                }, 400);
            }
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
            body.id = uuid();
            userService.createUser(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database error"
                    });
                }
                else {
                    return res.status(200).json({
                        success:1,
                        data: results
                    })
                }
            });
        }
    )
};

const getUsers = (req, res) => {
    userService.getUsers((err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database error"
            });
        }
        else {
            return res.status(200).json({ success: 1, data: results });
        }
    });
}

const getUserById = (req, res) => {
    const { id } = req.params;
    userService.getUserById(id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database error"
            });
        }
        else {
            return res.status(200).json({ success: 1, data: results });
        }
    });
}

const getUserByUsername = (req, res) => {
    const { username } = req.params;
    userService.getUserById(username, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database error"
            });
        }
        else {
            return res.status(200).json({ success: 1, data: results });
        }
    });
}

const login = (req, res) => {
    const body = req.body;
    userService.getUserByUsername(body.username, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database error"
            });
        }
        else if (!results) {
            return res.json({
                success: 0,
                message: "Invalid username or password"
            })
        }

        const loginResult = compareSync(body.password, results.password);
        if (loginResult) {
            results.password = undefined;
            const jsonToken = sign({ result: results }, process.env.JWT_ENCRYPTION, {
                expiresIn: process.env.JWT_EXPIRATION
            });
            return res.status(200).json({
                success: 1,
                message: "Login is successful",
                token: jsonToken
            });
        }
        else {
            return res.status(401).json({
                success: 0,
                message: "Invalid username or password"
            });
        }
    });
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    login
};