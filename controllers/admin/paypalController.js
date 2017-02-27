let router = require('express').Router();
let auth = require('../../helpers/auth-helper');
let paypal = require('paypal-rest-sdk');
let UserModel = require('../../models/UserModel').model;
let i20Model = require('../../models/i20_Model').model;
let PaypalInformation = require('../../models/PaypalInformationModel').model;
let PaypalConfiguration = require('../../config/paypal');
let Helper = require('../helper/helper_functions');
let async = require('async');

router.use((req, res, next)=>{
    PaypalInformation.findOne({}, (err, result)=>{
        if (err)
            return res.json(err);
        console.log(result);
        PaypalConfiguration.configuration_live.client_id = result.client_id;
        PaypalConfiguration.configuration_live.client_secret = result.client_secret;
        paypal.configure(PaypalConfiguration.configuration_live);
        next();
    });
});
router.get('/invoice-detail/:invoice_id', (req, res) => {
    if (!auth(req, res, 1))
        return false;
    let invoice_id = req.params.invoice_id;
    paypal.invoice.get(invoice_id, function (err, result) {
        if (err)
            return res.json(err);
        console.log(result);
        return res.json(result);
    })
});

router.delete('/invoice/:invoice_id', (req, res) => {
    if (!auth(req, res, 1))
        return false;
    let invoice_id = req.params.invoice_id;

    async.waterfall([
        function (done) {
            paypal.invoice.del(invoice_id, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                done(false, invoice_id)
            })
        },
        function (invoice_id, done) {
            //delete invoice from I20
        }
    ]);
});

router.get('/information', (req, res)=>{
    if (!auth(req, res))
        return;

    PaypalInformation.findOne({}, '-_id' ,(err, result)=>{
        if (err)
            return res.status(400).json(err);
        return res.json(result);
    })
});

router.put('/information', (req, res)=>{
    if (!auth(req, res, 2))
        return;

    let new_info = req.body;

    if (!Helper.checkProperties(new_info, ['email', 'first_name', 'last_name', 'business_name', 'client_id', 'client_secret', 'address', 'phone']))
        return res.status(400).json({message: 'information missed!'});

    PaypalInformation.findOneAndUpdate({}, new_info, function (err, result) {
        if (err)
            return res.status(400).json(err);
        return res.json(new_info);
    })
});


module.exports = router;