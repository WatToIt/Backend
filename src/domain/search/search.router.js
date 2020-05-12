const router = require("express").Router();
const {
    searchWithPrefs
} = require("./search.controller");
const{checkToken} = require("../../utils/tokenCheckMiddleware");


router.get('/', checkToken,searchWithPrefs);


module.exports = router;