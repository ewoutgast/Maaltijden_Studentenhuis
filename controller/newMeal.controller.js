var connection = require('../config/connection');
var path = require('path');
var fs = require('fs');

module.exports = {
    newMeal(req, res, next) {
        var newMealReq = req.body;
        var user = req.user;

        var query = 'SELECT * FROM users WHERE id=?';

        connection.query(query, user.id, function (error, rows, fields) {
            if(error){
                if(req.file != undefined) fs.unlink(req.file.path);
                next(error);
            } else if(rows.length != 1) {
                if(req.file != undefined) fs.unlink(req.file.path);
                res.status(400).json({
                    status: {
                        query: 'Bad Request: User does not exist'
                    }
                }).end();
            }else{
                if(!checkNewMealReq(newMealReq)){
                    if(req.file != undefined) fs.unlink(req.file.path);
                    res.status(400).json({
                        status: {
                            query: 'Bad Request'
                        }
                    }).end();
                }else{
                    insertNewMeal(req.file, newMealReq, user.id, res);
                }
            }
        });
    }
}

//Checks if new meal request has all needed fields
function checkNewMealReq(newMealReq){
    var date = new Date(newMealReq.datetime);
    var curDate = new Date();
    
    if(curDate > date || newMealReq.title == undefined || newMealReq.desc == undefined || newMealReq.max_people < 2){
        return false;
    }
    return true;
}

//Inserts new meal into DB
function insertNewMeal(newMealImg, newMealReq, userId, res){
    connection.query('INSERT INTO meals SET ?', {title: newMealReq.title, description: newMealReq.desc, datetime: newMealReq.datetime, max_amount: newMealReq.max_people, user_id: userId}, function (error, results, fields) {
        if(error){
            console.log(error);
            if(newMealImg != undefined) fs.unlink(newMealImg.path);
            res.status(500).json({
                status: {
                    query: 'Internal Server Error: Could not insert meal'
                }
            }).end();
        } else if(results.affectedRows < 1) {
            console.log('Affected rows less than 1.');
            if(newMealImg != undefined) fs.unlink(newMealImg.path);
            res.status(500).json({
                status: {
                    query: 'Internal Server Error: Could not insert meal'
                }
            }).end();
        }else{
            handleNewMealImg(newMealImg, newMealReq, userId, res, results.insertId);
        }
    });
}

//Checks the image for the new meal and gives it a name
function handleNewMealImg(newMealImg, newMealReq, userId, res, mealId){
    if(newMealImg != undefined){
        var tempPath = newMealImg.path;
        var extension = newMealImg.originalname.split('.').pop();

        var imgDate = new Date(newMealReq.datetime);
        var imgDateStr = imgDate.toISOString().replace(/(:)|(00.000Z)/g, '');
        var imgName = imgDateStr + '_' + userId + '_' + newMealReq.title + '.' + extension;
        
        var targetPath = path.resolve('./uploads/meal_img/' + imgName);

        insertImgDb(tempPath, targetPath, imgName, mealId, res);
    }else{
        res.status(400).json({
            status: {
                query: 'Bad Request: No image given. Meal created with NULL image.'
            }
        }).end();
    }
}

//Inserts imagename into DB and puts the image in the right folder
function insertImgDb(tempPath, targetPath, imgName, mealId, res){
    fs.rename(tempPath, targetPath, function(error){
        console.log('temp: ' + tempPath + ' - target: ' + targetPath);
        if(error) {
            console.log(error);
            res.status(500).json({
                status: {
                    query: 'Internal Server Error: Could not insert image. Meal created with NULL image.'
                }
            }).end();
        }else{
            connection.query('UPDATE meals SET image = ? WHERE id = ?', [imgName, mealId], function (error, results, fields) {
                if(error){
                    console.log(error);
                    res.status(500).json({
                        status: {
                            query: 'Internal Server Error: Could not insert image. Meal created with NULL image.'
                        }
                    }).end();
                } else if(results.affectedRows < 1) {
                    console.log('Affected rows less than 1.');
        
                    res.status(500).json({
                        status: {
                            query: 'Internal Server Error: Could not insert image. Meal created with NULL image.'
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
