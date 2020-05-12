const axios = require('axios');




const findRecipes = (searchParams) => {

    return axios.get(process.env.EDAMAM_API_HOST + searchParams);
};

module.exports = { findRecipes };