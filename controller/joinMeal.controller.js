var connection = require('../config/connection');

module.exports = {    
    joinMealById(req, res, next) {
        var body = req.body;

        if (
            (typeof body.meal_id !== 'undefined' && body.meal_id) &&
            (typeof body.user_id !== 'undefined' && body.user_id) &&
            (typeof body.guest_amount !== 'undefined')
        ){
            //Add yourself as guest
            body.guest_amount++;
            
            var userAlreadyJoined = checkUserAlreadyJoined(body.meal_id, body.user_id);
            var maxAmount = checkMaxAmount(body.meal_id, body.guest_amount);
            
            Promise.all([userAlreadyJoined, maxAmount]).then(() => {
                // Join meal
                var query = 'INSERT INTO meals_users SET ?';
                
                connection.query(query, {meal_id: body.meal_id, user_id: body.user_id, guest_amount: body.guest_amount}, function (error, rows, fields) {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({
                            status: {
                                message: 'OK'
                            }
                        }).end();
                        return false;
                    };
                });
            }).catch((error) => {
                if(error.reason === undefined){
                    console.log(error);
                }
                res.status(error.statusCode || 400).json({
                    status: {
                        message: error.reason || 'Check server log'
                    }
                }).end();
            });
        };
    }
};

function checkUserAlreadyJoined(meal_id, user_id) {
    return new Promise(
        function (resolve, reject){
            var query = 'SELECT id FROM meals_users WHERE meal_id = ? AND user_id = ? LIMIT 1';
            
            connection.query(query, [meal_id, user_id], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else if (rows.length == 1) {
                    reject({
                        code: 1,
                        reason: 'user already joined',
                        mealId: meal_id,
                        userId: user_id
                    });
                } else {
                    resolve();
                }
            });
        }
    );
}

function checkMaxAmount(meal_id, guest_amount, callback) {
    return new Promise(
        function (resolve, reject){
            var query = 'SELECT guest_amount FROM meals_users WHERE meal_id = ?';
            
            connection.query(query, meal_id, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return false;
                } else {
                    // Count all signup guests
                    var total_amount = 0;
            
                    rows.forEach(function(row) {
                        total_amount += row.guest_amount;
                    });
            
                    getMeal(meal_id).then((meal) => {
                        if (meal.max_amount >= (total_amount + guest_amount)) {
                            resolve();
                        } else {
                            reject({
                                code: 2,
                                reason: 'Guest amount to high',
                                max_amount: meal.max_amount,
                                oldTotal: total_amount,
                                newGuests: guest_amount
                            });
                        };
                    }).catch((error) => {
                        reject(error)
                    });
                }
            });
        }
    );
}

function getMeal(meal_id) {
    return new Promise(
        function(resolve, reject){
            var query = 'SELECT id, title, description, datetime, image, max_amount, user_id FROM meals WHERE id = ? LIMIT 1';

            connection.query(query, meal_id, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else if(rows.length < 1){
                    reject({
                        code: 3,
                        statusCode: 404,
                        reason: 'Meal not found',
                        mealId: meal_id
                    })
                } else {
                    resolve(rows[0]);
                };
            });
        }
    );
}