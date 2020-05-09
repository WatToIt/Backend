const preferenceService = require("./preference.service");
const { ResponseSuccess, ResponseError } = require("../../utils/response");
const uuid = require("uuid");
const { sign } = require("jsonwebtoken");
const { body, param, check, validationResult } = require('express-validator');
const { objectValueMap, objectKeyMap } = require("../../utils/helpers");



const validate = (method) => {
    switch (method) {
        case 'setDiet': return [
            body('diet', 'Diet should be added').exists(),
            body('diet', 'Diet should be in a list of allowed diets').isIn(['high_fiber',
                'high_protein',
                'balanced', 'low_carb', 'low_fat', 'low_sodium', 'none'
            ]),
        ];
        case 'setHealthLabel': return [
            body('kosher', 'All preferences should be included').exists(),
            body('dairy_free', 'All preferences should be included').exists(),
            body('peanut_free', 'All preferences should be included').exists(),
            body('pecatarian', 'All preferences should be included').exists(),
            body('pork_free', 'All preferences should be included').exists(),
            body('vegan', 'All preferences should be included').exists(),
            body('vegetarian', 'All preferences should be included').exists(),
            body('gluten_free', 'All preferences should be included').exists(),
            body('low_sugar', 'All preferences should be included').exists(),
        ]
        default: return []
    }
}

const setUserDiet = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
    }
    try {
        const body = req.body;
        const user = req.decoded.result;
        let dbQueryObject = Object.assign({}, body);
        dbQueryObject['user_id'] = user.id;
        await preferenceService.setDiet(dbQueryObject);
        return ResponseSuccess(res, "", 200);
    } catch (error) {
        return ResponseError(res, { message: "Error while setting diet", error }, 500);
    }
};

const getUserDiet = async (req, res) => {
    try {
        const user = req.decoded.result;
        const diets = await preferenceService.getDiet(user.id);
        return ResponseSuccess(res, diets, 200);
    } catch (error) {
        console.log(error);
        return ResponseError(res, { message: "Error while getting diet", error }, 500);
    }
};

const setUserHealthLabels = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseError(res, { message: "Validation unsuccessful", error: errors.array() }, 422);
    }
    try {
        const body = req.body;
        const user = req.decoded.result;
        let dbQueryObject = Object.assign({}, body);
        dbQueryObject['user_id'] = user.id;

        dbQueryObject = objectValueMap(dbQueryObject, (e) => {
            if (e == true) {
                return 1;
            }
            else if (e == false) {
                return 0;
            }
            else {
                return e;
            }
        });

        await preferenceService.setHealthLabel(dbQueryObject);
        return ResponseSuccess(res, "", 200);
    } catch (error) {
        return ResponseError(res, { message: "Error while setting health labels", error }, 500);
    }
};

const getUserHealthLabels = async (req, res) => {
    try {
        const user = req.decoded.result;
        const healthLabels = await preferenceService.getHealthLabel(user.id);
        return ResponseSuccess(res, healthLabels, 200);
    } catch (error) {
        console.log(error);
        return ResponseError(res, { message: "Error while getting health labels", error }, 500);
    }
}




module.exports = {
    setUserDiet,
    validate,
    getUserDiet,
    setUserHealthLabels,
    getUserHealthLabels
};