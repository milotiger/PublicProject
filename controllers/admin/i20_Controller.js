let router  = require('express').Router();
let I20     = require('../../models/i20_Model').model;
let auth    = require('../../helpers/auth-helper');
let helper_functions = require('../helper/helper_functions');
let profileModel = require('../../models/ThongTinCaNhanModel').model;

router.post('/check/:profile_id', (req, res)=>{
    if (!auth(req,res, 1))
        return;

    let profileId = req.params.profile_id;
    let profileItem = req.body.profile_item;
    let profileValue = req.body.value;

    if (!profileId || !profileItem || !profileValue)
    {
        return res.status(400).json({message: 'information missed!'});
    }

    if (!helper_functions.checkI20Item(profileItem))
    {
        return res.status(400).json({message: 'invalid item name'})
    }

    I20.findOne({_id: profileId}, function (err, result) {
        if (result == null)
            return res.status(400).json({message: 'profile not found!'});
        if (profileItem == 'Main')
            result.isCheck = profileValue;
        else
            result[profileItem].isCheck = profileValue;
        result.save(function (err, result) {
            if (err)
                return res.status(400).json(err);
            return res.json({status: 'susscess', item: profileItem, isCheck: profileValue});
        })
    });
});

router.get('/check/:profile_id/:profile_item', function (req, res) {
    if (!auth(req,res, 1))
        return;

    let profileId = req.params.profile_id;
    let profileItem = req.params.profile_item;

    if (!profileId || !profileItem)
    {
        return res.status(400).json({message: 'information missed!'});
    }

    if (!helper_functions.checkI20Item(profileItem))
    {
        return res.status(400).json({message: 'invalid item name'})
    }

    I20.findOne({_id: profileId}, function (err, result) {
        if (err) {
            return res.status(400).json(err);
        }
        if (result == null) {
            return res.status(400).json({message: 'profile not found'});
        }
        if (profileItem == 'Main')
            return res.json({item: profileItem, isCheck: result.isCheck})
        return res.json({item: profileItem, isCheck: result[profileItem].isCheck})
    })
});

router.post('/note/:profile_id', function (req, res) {
    if (!auth(req,res, 1))
        return;

    let profileId = req.params.profile_id;
    let profileItem = req.body.profile_item;
    let profileNote = req.body.admin_note;

    if (!profileId || !profileItem || !profileNote) {
        return res.status(400).json({message: 'information missed!'});
    }

    if (!helper_functions.checkI20Item(profileItem))
    {
        return res.status(400).json({message: 'invalid item name'})
    }

    I20.findOne({_id: profileId}, function (err, result) {
        if (result == null)
            return res.status(400).json({message: 'profile not found!'});
        if (profileItem == 'Main')
            result.AdminNote.push(profileNote);
        else
        result[profileItem].AdminNote.push(profileNote);
        result.save(function (err, result) {
            if (err)
                return res.status(400).json(err);
            if (profileItem == 'Main')
                return res.json({status: 'susscess', item: profileItem, AdminNote: result.AdminNote});
            else
                return res.json({status: 'susscess', item: profileItem, AdminNote: result[profileItem].AdminNote});
        })
    });
});

router.get('/note/:profile_id/:profile_item', function (req, res) {
    if (!auth(req,res, 1))
        return;

    let profileId = req.params.profile_id;
    let profileItem = req.params.profile_item;

    if (!profileId || !profileItem)
    {
        return res.status(400).json({message: 'information missed!'});
    }

    if (!helper_functions.checkI20Item(profileItem))
    {
        return res.status(400).json({message: 'invalid item name'})
    }

    I20.findOne({_id: profileId}, function (err, result) {
        if (err) {
            return res.status(400).json(err);
        }
        if (result == null) {
            return res.status(400).json({message: 'profile not found'});
        }
        if (profileItem == 'Main')
            return res.json({item: profileItem, AdminNote: result.AdminNote});
        return res.json({item: profileItem, AdminNote: result[profileItem].AdminNote});
    })
});

router.get('/file-url/:profile_id', (req, res) => {
    if (!auth(req,res, 1))
        return;

    let profile_id = req.params.profile_id;

    let select = 'HocBa.FileUrl HocBa.FileEngUrl ';
    select += 'BangTotNghiep.FileUrl BangTotNghiep.FileEngUrl ';
    select += 'BangTiengAnh.FileUrl ';
    select += 'HoChieu.FileUrl ';
    select += 'HinhHoChieu.FileUrl ';
    select += 'ChuKy.FileUrl ';
    select += 'BieuMau.CMTCTruong BieuMau.CMTCNganHang BieuMau.KSKTruong BieuMau.KSKBenhVien ';

    I20.findOne({_id: profile_id}, select, function (err, result) {
        if (err)
            return res.status(400).json({message: err});
        return res.json(result);
    })
});

router.get('/form-info/:profile_id', (req, res) => {
    // if (!auth(req,res, 1))
    //     return;
    
    let select = 'UserId Truong.Id';

    let profile_id = req.params.profile_id;

    I20.findOne({_id: profile_id}, select, function (err, result) {
        if (err)
            return res.status(400).json({message: err});
        profileModel.findOne({UserId : result.UserId},'_id', (err, data) => {
            console.log(result);
            console.log(data);
            if(err) {
                return res.status(400).json({message: err});
            }
            let resp = {};
            resp.info = data._id;
            resp.school = result.Truong.Id;
            res.status(200).json(resp);
        });
    })
});

module.exports = router;

