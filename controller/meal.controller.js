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
        const id = req.params.id;
        
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
        // res.end();
    }
};