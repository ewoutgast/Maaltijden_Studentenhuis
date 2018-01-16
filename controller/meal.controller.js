var fs = require('fs');
var connection = require('../config/connection');

module.exports = {
    getAll(req, res, next) {
        var query = 'SELECT id, title, description, datetime, image, max_amount, user_id FROM meals';
        
        connection.query(query, function (error, rows, fields) {
            if (error) {
                next(error);
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
        var id = req.params.id;
      
        var query = 'SELECT * FROM meals WHERE id=' + id;
        
        connection.query(query, function (error, rows, fields) {
            if (error) {
                next(error);
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

    getImage(req, res, next){
        var imgReq = req.params.imgName;
        try{
            var img = fs.readFileSync('./uploads/meal_img/' + imgReq);
        
            var imgExt = imgReq.split('.').pop();
    
            res.contentType('image/' + imgExt);
            res.status(200).end(img, 'binary');
        }catch(ex){
            res.status(404).json({
                status: {
                    message: 'Image not found'
                }
            }).end();
        }
    }
};
