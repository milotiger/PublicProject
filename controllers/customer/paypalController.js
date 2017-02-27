let router = require('express').Router();
let auth = require('../../helpers/auth-helper');
let paypal = require('paypal-rest-sdk');
let UserModel = require('../../models/UserModel').model;
let i20Model = require('../../models/i20_Model').model;
let PaypalInformation = require('../../models/PaypalInformationModel').model;
let FeesModel = require('../../models/FeesModel').model;
let PaypalConfiguration = require('../../config/paypal');
let Helper = require('../helper/helper_functions');
let async = require('async');

//paypal.configure(PaypalConfiguration.configuration_live);

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

router.post('/send-invoice/:i20_id', function (req, res) {
    if (!auth(req, res))
        return;

    let i20_id = req.params.i20_id;
    let email = req.body.Email;
    let currentI20 = {};
    let invoice_metadata = {};
    let create_invoice_json = JSON.parse(JSON.stringify(PaypalConfiguration.invoice_json)); //clone a template

    if (!Helper.validateEmail(email))
        return res.status(400).json({message: "email address is not valid"});
    create_invoice_json.billing_info[0].email = email;

    async.waterfall([
        function (done) { //find i20 profile
            i20Model.findOne({_id: i20_id}, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                currentI20 = result;
                if (result.Invoices && result.Invoices.length >= 10) {
                    return res.status(400).json({message: "Out of Invoices Limit", Invoices: result.Invoices});
                }

                if (!result.Fees || result.Fees.length == 0) {
                    FeesModel.findOne({Name: "I20"}, function (err, fees) {
                        if (err)
                            return res.status(400).json(err);
                        console.log(i20_id + " get current fees");
                        currentI20.Fees = fees.Fees;
                        done(err, currentI20.Fees);
                    })
                }
                else
                    done(err, currentI20.Fees);
            })
        },
        function (fees, done) { //push fees items to json
            fees.forEach(function (fee) {
                create_invoice_json.items.push({name: fee.Name_vi, quantity: 1, unit_price:{currency: 'USD', value: fee.Fee}});
            });
            //res.json(create_invoice_json);
            done(false, create_invoice_json);
        },
        function (invoice_json, done) { //retrieve bussiness information from database
            PaypalInformation.findOne({}, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                invoice_json.merchant_info = result;
                done(false, invoice_json);
            })
        },
        function (invoice_json, done) { //create invoice
            console.log(invoice_json);
            paypal.invoice.create(invoice_json, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                done(false, result.id);
            });
        },
        function (invoice_id, done) { //send the created invoice with its id
            console.log(invoice_id);
            paypal.invoice.send(invoice_id, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                done(false, invoice_id);
            })
        },
        function (invoice_id, done) { //retrieve invoice detail to get direct link
            paypal.invoice.get(invoice_id, function (err, result) {
                if (err)
                    return res.json(err);
                console.log(result);
                invoice_metadata = result.metadata;
                done(false, invoice_id);
            })
        },
        function (invoice_id, done) { //update invoice id in user's i20 profile for future check
            currentI20.Invoices.push(invoice_id);
            currentI20.save(function (err, result) {
                if (err)
                    return res.status(400).json(err);
                result.metadata = invoice_metadata;
                return res.json({invoice_metadata: invoice_metadata});
            })
        }
    ])
});

router.get('/invoice-detail/:invoice_id', (req, res)=>{
    console.log('later');
    if (!auth(req, res))
        return false;
    let invoice_id = req.params.invoice_id;
    paypal.invoice.get(invoice_id, function (err, result) {
        if (err)
            return res.json(err);
        console.log(result);
        return res.json({
            status:         result.status,
            merchant_info:  result.merchant_info,
            billing_info:   result.billing_info,
            items:          result.items,
            metadata:       result.metadata
        });
    })
});

router.get('/check-paid/:i20_id', (req, res)=>{
    if (!auth(req, res))
        return;

    let i20_id = req.params.i20_id;
    let currentI20 = {};

    async.waterfall([
        function (done) { //find i20 profile
            i20Model.findOne({_id: i20_id}, function (err, result) {
                if (err)
                    return res.status(400).json(err);
                currentI20 = result;
                if (!result.Invoices ||result.Invoices.length == 0)
                    return res.status(400).json({status: "UNPAID", invoices: []});
                done(err, result.Invoices);
            })
        },
        function (Invoices, done) {
            let Invoice_promises = Invoices.map((invoice)=>{
                return new Promise((resolve, reject) => {
                    paypal.invoice.get(invoice, function (err, result) {
                        if (err)
                            res.status(400).json(err);
                        if (result.status == "PAID")
                            res.json({status: "PAID", invoice: result});
                        resolve(result);
                    })
                })
            });
            Promise.all(Invoice_promises).then((data)=>{
                res.json({status: "UNPAID", invoices: Invoices});
            })
        }
    ])
});



module.exports = router;