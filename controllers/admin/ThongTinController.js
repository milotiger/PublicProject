"use strict";
let router = require('express').Router();
let ThongTinModel = require('../../models/ThongTinCaNhanModel').model;
let auth = require('../../helpers/auth-helper');

router.get('/check/:user_id', (req, res) => {
    if (!auth(req,res, 1))
        return;

    let user_id = req.params.user_id;

    ThongTinModel.findOne({UserId: user_id},'isCheck HoTen' ,(err, result) => {
        if (err)
            return res.status(400).json({message: err});
        return res.json(result);
    })
});

router.put('/check/:user_id',  (req, res) => {
    if (!auth(req,res, 1))
        return;

    let user_id = req.params.user_id;
    let isCheck = req.body.isCheck;

    ThongTinModel.findOneAndUpdate({UserId: user_id}, {isCheck: isCheck}, (err, result)=>{
        if (err)
            return res.status(400).json(err)
        return res.json({message: 'success', isCheck: isCheck, HoTen: result.HoTen});
    })
});

module.exports = router;