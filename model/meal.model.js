var connection = require('../config/connection');

module.exports = {
    checkUserAlreadyJoined(meal_id, user_id) {
        return false;
    },
    
    checkMaxAmount(meal_id, amount) {
        return true;
    }
};