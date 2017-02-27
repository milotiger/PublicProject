let route = require('express').Router();
let UserModel = require('../../models/ThongTinCaNhanModel').model;
let jwt = require('../../helpers/jwt-helper');

route.get('/user/:id', function (req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];
    // return res.json(token);
    if (!jwt.checkToken(token)) {
        return res.status(401).json({message: "Invalid Token"});
    }

    let searchId = req.params.id;
    UserModel.findOne({UserId: searchId}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "user not found!"});
        }
        else {
            return res.status(200).json(result);
        }
    })
});

route.post('/update/:id', function (req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];
    
    if (!jwt.checkToken(token)) {
        return res.status(401).json({message: "Invalid Token"});
    }
    
    let id = req.params.id;
    let newProfileData = req.body;
    newProfileData.UserId = id;

    UserModel.findOne({UserId: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "user not found!"});
        }
        result = copyObject(result, newProfileData);

        result.save(function (err) {
            if (!err) {
                return res.json(result);
            } else {
                return res.status(400).json(err);
            }
        })
    });
});

function copyObject(src, obj) {
    for (let key in obj) {
        if (obj[key]) {
            src[key] = obj[key];
        }
    }
    return src;
}

module.exports = route;