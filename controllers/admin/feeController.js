let route = require('express').Router();
let auth = require('../../helpers/auth-helper');
let feesModel = require('../../models/FeesModel').model;

route.get('/', (req, res)=>{
    if (!auth(req, res, 1))
        return;
    feesModel.findOne({ Name: "I20" }, function(err, result) {
        if (err)
            return res.status(400).json({ message: err });
        return res.json(result);
    })
});

route.post('/', (req, res) => {
    if (!auth(req, res, 1))
        return;
    let newFee = req.body;

    feesModel.findOne({Name: "I20"}, function (err, result) {
        if (err)
            return res.status(400).json({mesage: err});
        result.Fees.push(newFee);
        result.save(function (err, result) {
            if (err)
                return res.status(400).json({mesage: err});
            return res.json({message: 'success', curr: result});
        })
    })
});

route.put('/', (req, res)=>{
    if (!auth(req, res, 1))
        return;
    let CurrFee = req.body.curr;
    let NewFee = req.body.new;

    feesModel.findOne({Name: "I20"}, function (err, result) {
        if (err)
            return res.status(400).json({mesage: err});
        let index = result.Fees.findIndex((x)=>{return x.Fee == CurrFee.Fee && x.Name_vi == CurrFee.Name_vi});
        if (index < 0)
            return res.status(400).json({message: 'can not find fee item'});
        result.Fees.splice(index, 1);

        result.Fees.push(NewFee);

        result.save(function (err, result) {
            if (err)
                return res.status(400).json({mesage: err});
            return res.json({message: 'success', curr: result});
        })
    })
});

route.delete('/', (req, res) => {
    if (!auth(req, res, 1))
        return;
    let delFee = req.body;

    feesModel.findOne({Name: "I20"}, function (err, result) {
        if (err)
            return res.status(400).json({mesage: err});
        let index = result.Fees.findIndex((x)=>{return x.Fee == delFee.Fee && x.Name_vi == delFee.Name_vi});
        if (index < 0)
            return res.status(400).json({message: 'can not find fee item'});
        result.Fees.splice(index, 1);
        result.save(function (err, result) {
            if (err)
                return res.status(400).json({mesage: err});
            return res.json({message: 'success', curr: result});
        })
    })
});

module.exports = route;