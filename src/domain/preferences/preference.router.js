const router = require("express").Router();
const {
    setUserDiet,
    getUserDiet,
    setUserHealthLabels,
    getUserHealthLabels,
    validate
} = require("./preference.controller");
const{checkToken} = require("../../utils/tokenCheckMiddleware");


router.post('/diet/set/', checkToken, validate('setDiet'),  setUserDiet);
router.get('/diet/get/', checkToken,  getUserDiet);
router.post('/health-label/set/', checkToken, validate('setHealthLabel'),  setUserHealthLabels);
router.get('/health-label/get/', checkToken,  getUserHealthLabels);


// router.post('/health-label/set/',validate('health'), login);
// router.get('/:id',checkToken, getUserById);
// router.get("/", checkToken, getUsers);
// router.post("/", checkToken, validate('createUser'),  createUser);
// router.get("/username/:username", getUserByUsername);


module.exports = router;