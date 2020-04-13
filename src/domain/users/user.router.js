const router = require("express").Router();
const {
    login,
    getUserById,
    getUserByUsername,
    createUser,
    getUsers
} = require("./user.controller");
const{checkToken} = require("../../utils/tokenCheckMiddleware");


router.post('/login/', login)
router.get('/:id', checkToken, getUserById);
router.get("/", checkToken, getUsers);
router.post("/", checkToken, createUser);
router.get("/username/:username", getUserByUsername);


module.exports = router;