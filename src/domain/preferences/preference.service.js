const pool = require("../../config/database");


const setDiet = (data) => {
    return pool.query("INSERT INTO user_diet SET ? ON DUPLICATE KEY UPDATE diet=VALUES(diet)", data);
}
const getDiet = (id) => {
    return pool.query("SELECT * from user_diet WHERE user_id =?",[id]);
}

const setHealthLabel = (data) => {
    return pool.query("INSERT INTO user_health_labels SET ? ON DUPLICATE KEY UPDATE kosher=VALUES(kosher), dairy_free=VALUES(dairy_free),peanut_free =VALUES(peanut_free), pecatarian=VALUES(pecatarian),pork_free=VALUES(pork_free),vegan=VALUES(vegan),vegetarian=VALUES(vegetarian),gluten_free=VALUES(gluten_free),low_sugar=VALUES(low_sugar)", data);
}

const getHealthLabel = (id) => {
    return pool.query("SELECT * from user_health_labels WHERE user_id =?",[id]);
}


module.exports = {
    setDiet,
    getDiet,
    setHealthLabel,
    getHealthLabel
}