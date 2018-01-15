var connection = require('../config/connection');

module.exports = {
    leaveMealById(req, res, next) {
        var body = req.body;

         if (
             (typeof body.meal_id !== 'undefined' && body.meal_id) &&
             (typeof body.user_id !== 'undefined' && body.user_id)
         ){
             // Check user already joined
            // console.log(checkUserIsJoined(body.meal_id, body.user_id));
            if (!checkUserIsJoined(body.meal_id, body.user_id)) {
                res.status(400).json({
                    status: {
                        message: 'User is not joined'
                    }
                }).end();
                return false;
            };
             
             // Leave meal by ID
             var query = 'DELETE FROM meals_users WHERE meal_id = ' + body.meal_id + ' AND user_id = ' + body.user_id;

            connection.query(query, function (error, rows, fields) {
                if (error) {
                    next(error);
                } else {
                    res.status(200).json({
                        status: {
                            message: 'OK'
                        }
                    }).end();
                };
            });
        };
    }
};

function checkUserIsJoined(meal_id, user_id) {
    var query = 'SELECT id FROM meals_users WHERE meal_id = ' + meal_id + ' AND user_id = ' + user_id;
    var result;

    connection.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
            result = false;
        } else if (rows.length != 1) {
            result = false;
        } else {
            result = true;
        };
    });

console.log(result);
    return result;
}