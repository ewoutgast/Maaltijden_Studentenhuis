var connection = require('../config/connection');

module.exports = {    
    joinMealById(req, res, next) {
        var body = req.body;

        if (
            (typeof body.meal_id !== 'undefined' && body.meal_id) &&
            (typeof body.user_id !== 'undefined' && body.user_id) &&
            (typeof body.guest_amount !== 'undefined' && body.guest_amount)
        ){
            // Check user already joined
            if (!checkUserAlreadyJoined(body.meal_id, body.user_id)) {
                res.status(400).json({
                    status: {
                        message: 'User already joined'
                    }
                }).end();
            };
            
            // Check max amount
            if (!checkMaxAmount(body.meal_id, body.guest_amount)) {
                res.status(400).json({
                    status: {
                        message: 'Max amount guests'
                    }
                }).end();   
            };
            
            // Join meal
            var query = 'INSERT INTO meals_users (meal_id, user_id, guest_amount) VALUES (' + body.meal_id + ',' + body.user_id + ',' + body.guest_amount + ')';

            connection.query(query, function (error, rows, fields) {
                if (error) {
                    next(error);
                } else {
                    res.status(200).json({
                        status: {
                            message: 'OK'
                        },
                        result: rows
                    }).end();
                };
            });
        } else {
            res.status(500).json({
                status: {
                    message: 'ERROR'
                }
            }).end();   
        };
    }
};


function checkUserAlreadyJoined(meal_id, user_id) {
    var query = 'SELECT id FROM meals_users WHERE meal_id = ' + meal_id + ' AND user_id = ' + user_id + ' LIMIT 1';

    connection.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
            return false;
        } else if (rows.length != 1) {
            return false;
        }
    });
    
    return true;
}

function checkMaxAmount(meal_id, guest_amount) {
    return true;
}
