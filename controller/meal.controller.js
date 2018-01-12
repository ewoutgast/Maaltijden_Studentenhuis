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
    },

    newMeal(req, res, next) {
        var newMealReq = req.body;

        if(newMealReq.user == undefined){
            res.status(400).json({
                status: {
                    query: 'Bad Request: User has to be defined'
                }
            }).end();
        }

        console.log(JSON.stringify(newMealReq));

        var query = 'SELECT * FROM users WHERE id=' + newMealReq.user;

        connection.query(query, function (error, rows, fields) {
            if(error){
                next(error);
            } else if(rows.length != 1) {
                res.status(400).json({
                    status: {
                        query: 'Bad Request: User does not exist'
                    }
                }).end();
            }else{
                if(!checkNewMealReq(newMealReq)){
                    return false;
                }
            
                var success = false;
            
                connection.query('INSERT INTO meals SET ?', {title: newMealReq.title, description: newMealReq.desc, datetime: newMealReq.datetime, image: "", max_amount: newMealReq.max_people, user_id: newMealReq.user}, function (error, results, fields) {
                    if(error){
                        console.log(error);
                        next(error);
                    } else if(results.affectedRows < 1) {
                        console.log('Affected rows less than 1.');
                        res.status(500).json({
                            status: {
                                query: 'Internal Server Error: Could not insert meal'
                            }
                        }).end();
                    }else{
                        res.status(200).json({
                            status: {
                                query: 'OK'
                            }
                        }).end();
                    }
                });
            }
        });
    }
};

function checkNewMealReq(newMealReq){
    var date = new Date(newMealReq.datetime);
    var curDate = new Date();
    
    if(curDate > date || newMealReq.title == undefined || newMealReq.desc == undefined || newMealReq.max_people < 2){
        return false;
    }
    return true;
}