var connection = require('../config/connection');

module.exports = {
    getAll(req, res, next) {
        var query = 'SELECT m.id, m.title, m.description, m.datetime, m.max_amount, m.user_id, (SELECT SUM(mu.guest_amount) FROM meals_users mu WHERE mu.meal_id = m.id) AS amount FROM meals m';
        
        connection.query(query, function (error, rows, fields) {
            if (error) {
                next(error);
                return false;
            } else if (rows.length < 1) {
                res.status(400).json({
                    status: {
                        message: 'No meals found'
                    }
                }).end();
                return false;
            } else {
                res.status(200).json({
                    status: {
                        message: 'OK'
                    },
                    result: rows
                }).end();
                return true;
            };
        });
    },
    
    getById(req, res, next) {
        var query = 'SELECT id, title, description, datetime, image, max_amount, user_id FROM meals WHERE id = ?';
        
        connection.query(query, req.params.id, function (error, rows, fields) {
            if (error) {
                next(error);
                return false;
            } else if (rows.length < 1) {
                res.status(400).json({
                    status: {
                        message: 'No meal found'
                    }
                }).end();
                return false;
            } else {
                res.status(200).json({
                    status: {
                        message: 'OK'
                    },
                    result: rows
                }).end();
                return true;
            };
        });
    }
};
