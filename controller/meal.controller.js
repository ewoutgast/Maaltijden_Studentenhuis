var connection = require('../config/connection');

module.exports = {
    getAll(req, res, next) {
        var query = 'SELECT * FROM meals';
        
        connection.query(query, function (error, rows, fields) {
            if (error) {
                next(error);
            } else {
                res.status(200).json({
                    status: {
                        query: 'OK'
                    },
                    result: rows
                }).end();
            };
        });
    },
    
    getById(req, res, next) {
        var id = req.params.id;
        
        var query = 'SELECT * FROM meals WHERE id=' + id;
        
        connection.query(query, function (error, rows, fields) {
            if (error) {
                next(error);
            } else {
                res.status(200).json({
                    status: {
                        query: 'OK'
                    },
                    result: rows
                }).end();
            };
        });
    },
    
    joinMealById(req, res, next) {
        var body = req.body;

        if (
            (typeof body.meal_id !== 'undefined' && body.meal_id) &&
            (typeof body.user_id !== 'undefined' && body.user_id) &&
            (typeof body.guest_amount !== 'undefined' && body.guest_amount)
        ){
            // TODO: Check values etc...
            
            var query = 'INSERT INTO meals_users (meal_id, user_id, guest_amount) VALUES (' + body.meal_id + ',' + body.user_id + ',' + body.guest_amount + ')';

            connection.query(query, function (error, rows, fields) {
                if (error) {
                    next(error);
                } else {
                    res.status(200).json({
                        status: {
                            query: 'OK'
                        },
                        result: rows
                    }).end();
                };
            });
        } else {
            res.status(500).json({
                status: {
                    query: 'ERROR'
                }
            }).end();   
        };
    }
};