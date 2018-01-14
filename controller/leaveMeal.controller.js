var connection = require('../config/connection');

module.exports = {
    leaveMealById(req, res, next) {
        var body = req.body;

         if (
             (typeof body.meal_id !== 'undefined' && body.meal_id) &&
             (typeof body.user_id !== 'undefined' && body.user_id)
         ){
             // TODO: check user is signup
             
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