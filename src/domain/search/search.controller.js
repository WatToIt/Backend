const searchService = require("./search.service");
const prefService = require("../preferences/preference.service");
const { ResponseSuccess, ResponseError } = require("../../utils/response");
const { fold } = require("../../utils/helpers");

const searchWithPrefs = async (req, res) => {
    try {
        const user = req.decoded.result;
        const searchQuery = req.query.q;
        if (!searchQuery) {
            return ResponseError(res, { message: "No search query found" }, 422);
        }
        const diet = await prefService.getDiet(user.id);
        const healthLabels = await prefService.getHealthLabel(user.id);
        const searchParams = [];
        
        searchParams.push({ app_id: process.env.EDAMAM_APP_ID });
        searchParams.push({ app_key: process.env.EDAMAM_APP_KEY });
        
        searchParams.push({ q: searchQuery });
        if (typeof diet !== 'undefined' && diet.length > 0) {
            if (diet[0].diet != 'none') searchParams.push({ diet: diet[0].diet.replace("_", "-") });
        }

        // if (typeof healthLabels !== 'undefined' && healthLabels.length > 0) {
        //     Object.keys(healthLabels[0]).forEach((e) => {
        //         if (healthLabels[0][e] == 1) {
        //             searchParams.push({
        //                 health: e.replace("_", "-")
        //             });
        //         }
        //     });
        // }
        const paramsReducer = (qString, param) => {
            const key = Object.keys(param)[0];
            let startSign = "&";
            if(qString.length==0){
                startSign = "?"
            }
            return qString +startSign+ key+"="+param[key];
        }
        const searchParamsInQuery = await fold(paramsReducer,"",searchParams);
        console.log(searchParamsInQuery);
        const searchResults = await searchService.findRecipes(searchParamsInQuery);

        return ResponseSuccess(res, searchResults.data.hits, 200);
    } catch (error) {
        // console.log(error);
        return ResponseError(res, { message: "Error while search", error }, 500);
    }
}

module.exports = {
    searchWithPrefs
};