"use strict";
let router = require('express').Router();
let UserModel = require('../../models/UserModel').model;
let ServiceModel = require('../../models/ServiceModel').model;
let auth = require('../../helpers/auth-helper');

//Query câc dịch vụ
router.get('/query/:query', function (req, res) {
    if (!auth(req,res, 1))
        return;
    let query = req.params.query;
    //Tất cả dịch vụ
    if (query == 'all') {
        ServiceModel.find({})
            .populate('userID', '-_id -activeAccountToken -isActive -Password -__v')
            .populate('agencyID', '-_id -activeAccountToken -isActive -Password -__v')
            .exec(function (err, result) {
                if (err)
                    return res.status(400).json({message: err});
                else res.json(result);
            })
    }
    //Dịch vụ mới, chưa có người follow
    else if (query == 'free') {
        ServiceModel.find({agencyID: null})
            .populate('userID', '-_id -activeAccountToken -isActive -Password -__v')
            .populate('agencyID', '-_id -activeAccountToken -isActive -Password -__v')
            .exec(function (err, result) {
                if (err)
                    return res.status(400).json({message: err});
                else res.json(result);
            })
    }
    //Dịch vụ đã gán ngươi follow
    else if (query == 'assigned') {
        ServiceModel.find({agencyID: { $ne: null }})
            .populate('userID', '-_id -activeAccountToken -isActive -Password -__v')
            .populate('agencyID', '-_id -activeAccountToken -isActive -Password -__v')
            .exec(function (err, result) {
                if (err)
                    return res.status(400).json({message: err});
                else res.json(result);
            })
    }
    else return res.status(400).json({message: 'wrong query!'});
});

//Tìm tất cả các hồ sơ của agency
router.get('/agency/:agency_id', function (req, res) {
    if (!auth(req,res, 1))
        return;
    let AgencyId = req.params.agency_id;

    console.log(AgencyId);

    ServiceModel.find({agencyID: AgencyId})
        .populate('userID', 'HoTen')
        .populate('profileID', 'Truong')
        .exec(function (err, result) {
            if (err)
                return res.status(400).json(err);
            if (result.length == 0)
                return res.json([]);
            return res.json(result);
        })
});

//Gán hồ sơ cho agency quản lý
router.post('/assign/:service_id', function (req, res) {
    if (!auth(req,res, 1))
        return;
    let AgencyId = req.body.AgencyId;
    let ProfileId = req.params.service_id;

    UserModel.findOne({_id: AgencyId, LoaiTaiKhoan: {$gt: 0}}, function (err, result) {
        if (result == null)
            return res.status(400).json({message: 'Agency/Admin/Employee Not Found!'});

        ServiceModel.findOne({_id: ProfileId}, function (err, result) {
            if (result == null)
                return res.status(400).json({message: 'Profile Not Found!'});
            result.agencyID = AgencyId;
            result.save(function (err, result) {
                return res.json(result);
            });
        })
    })
});

//Cập nhật admin step cho service
router.put('/admin-step/:service_id', function (req, res) {
    if (!auth(req,res, 1))
        return;

    let ServiceID = req.params.service_id;
    let AdminStep = req.body.AdminStep;

    ServiceModel.findOne({_id: ServiceID}, function (err, result) {
        if (err)
            return res.status(400).json(err);
        if (!result)
            return res.status(404).json({message: 'service not found'});
        result.AdminStep = AdminStep;
        if (result.StepTracking.find(x => x.Step == AdminStep) == undefined)
            result.StepTracking.push({Step: AdminStep, TimeStamp: Date.now()});
        else result.StepTracking.find(x => x.Step == AdminStep).TimeStamp = Date.now();
        result.save(function (err, result) {
            if (err)
                return res.status(400).json(err);
            return res.json(result);
        })
    })
});

module.exports = router;

function checkExistTrackingStep(StepTracking, Step) {

}
