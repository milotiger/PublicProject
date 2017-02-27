let router = require('express').Router();
let serviceModel = require('../../models/ServiceModel').model;
let profileModel = require('../../models/i20_Model').model;
let userModel = require('../../models/UserModel').model;
let jwt = require('../../helpers/jwt-helper');

//Không cần truyền Id, trong token đã chứa data này rồi
router.post('/', function(req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    let tokenData = jwt.checkToken(token);
    if (!tokenData)
        return res.status(401).json({ message: "Invalid Token" });

    userModel.findOne({ '_id': tokenData.data.Id }, function(err, user) {
        if (!user) {
            return res.status(401).json({ 'error': true, 'message': err });
        } else {
            if (!user.isActive) return res.json({ 'error': 'notactive', 'message': 'Active Your Account First' });

            let id = tokenData.data.Id;

            let newService = new serviceModel(req.body);
            // newService = ;
            newService.TimeStamp = Date.now();

            let newProfile = {};

            if (newService.serviceType == 1) {
                newProfile = new profileModel();
                newProfile.UserId = id;
                newProfile.save(function(err, savedProfile) {
                    if (!err) {
                        newService.profileID = savedProfile._id;
                        newService.save(function(err2, savedService) {
                            if (!err2) {
                                return res.json(savedService);
                            } else
                                return res.status(400).json(err2);
                        })
                    } else
                        return res.status(400).json(err);
                })
            } else {
                return res.status(400).json({ message: 'unsupported service!', data: newService, input: req.body });
            }
        }
    });
});

router.get('/', function(req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    let tokenData = jwt.checkToken(token);
    if (!tokenData)
        return res.status(401).json({ message: "Invalid Token" });

    let userID = tokenData.data.Id;

    // serviceModel.find({ userID: userID }), function(err, result) {
    //     if( !err )
    //         return res.json(result);
    // })
    serviceModel.find({userID: userID})
        .populate('agencyID', 'HoTen Email')
        .exec(function (err, result) {
            if (err)
                return res.status(400).json(err);
            return res.json(result);
        })
});

router.post('/update/:id', function(req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    let tokenData = jwt.checkToken(token);
    if (!tokenData)
        return res.status(401).json({ message: "Invalid Token" });

    let stage = req.body.stage;
    let profileID = req.params.id;

    serviceModel.findOne({ profileID: profileID }, function(err, result) {
        if (result) {
            result.stage = stage;
            result.TimeStamp = Date.now();
            result.save(function(err, saved) {
                if (!err) {
                    return res.json(saved);
                } else return res.status(400).json(err);
            })
        }
    })
});

module.exports = router;
