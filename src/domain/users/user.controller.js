const userService = require("./user.service");
const { ResponseSuccess, ResponseError } = require("../../utils/response");
const uuid = require("uuid");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { body, param, validationResult } = require('express-validator');



const validate = (method) => {
    switch (method) {
        case 'createUser': return [
            body('username', 'username field is not found').exists(),
            body('email', 'email is not found or incorrect').exists().isEmail(),
            body('password', 'password is not found').exists()
        ]
        case 'login': return [
            body('username', 'username is not found').exists(),
            body('password', 'password not found').exists()
        ]
    }
}

const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
        }
        const body = req.body;

        const isUserUnique = await userService.isUserUnique(body.username, body.email);
        if (isUserUnique && isUserUnique.length != 0) {
            return ResponseError(res, { message: "User with such name exists" }, 400);
        }

        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.id = uuid();
        const creationResults = await userService.createUser(req.body);
        return ResponseSuccess(res, creationResults, 200);
    }
    catch (error) {
        console.log(error);
        return ResponseError(res, { message: "Error while creating user", error }, 500);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        return ResponseSuccess(res, users, 200);
    } catch (error) {
        return ResponseError(res, { message: "Error while getting users", error }, 500);
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
    }
    try {
        const user = await userService.getUserById(id);
        if (user && user.length == 0) {
            return ResponseError(res, { message: "User with such username not found" }, 404);
        }
        else {
            console.log(user[0]);
            return ResponseSuccess(res, user[0], 200);
        }
    } catch (error) {
        return ResponseError(res, { message: "Error while getting user by username", error }, 404);
    }
}

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
    }
    try {
        const user = await userService.getUserByUsername(username);
        if (user && user.length == 0) {
            return ResponseError(res, { message: "User with such username not found" }, 404);
        }
        else {
            return ResponseSuccess(res, user[0], 200);
        }
    } catch (error) {
        return ResponseError(res, { message: "Error while getting user by username", error }, 500);
    }
}

const login = async (req, res) => {
    const body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
    }
    try {

        const foundUser = await userService.getUserByUsername(body.username);
        if (foundUser && foundUser.length == 0) {
            return ResponseError(res, { message: "Invalid username or password" }, 401);
        }
        const user = foundUser[0];
        const loginResult = compareSync(body.password, user.password);
        if (loginResult) {
            user.password = undefined;
            const jsonToken = sign({ result: user }, process.env.JWT_ENCRYPTION, {
                expiresIn: process.env.JWT_EXPIRATION
            });
            return res.status(200).json({
                success: 1,
                message: "Login is successful",
                token: jsonToken
            });
        }
        else {
            return ResponseError(res, { message: "Invalid username or password" }, 401);
        }

    } catch (error) {
        return ResponseError(res, { message: "Error while login", error }, 500);
    }

};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    login,
    validate
};