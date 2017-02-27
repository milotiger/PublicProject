const schoolModel = require('../../models/DanhSachTruongModel').model;
const router = require('express').Router();
const feeModel = require('../../models/FeesModel').model;
const formsModel = require('../../models/FormsModel').model;
const auth = require('../../helpers/auth-helper');
const multiparty = require('connect-multiparty');
const fs = require('fs');
const multipartyMiddleware = multiparty({ maxFilesSize: 1024 * 1024 * 1024 });

const s3fs = require('s3fs');
const s3Options = {
    accessKeyId: 'AKIAIWBBD7XNUD72EYTA',
    secretAccessKey: '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'
};
const s3fsImpl = new s3fs('masdoc15011995', s3Options);

/*
 * Start school API *
                    */

router.route('/school')
    .post((req, res) => {
        if (!auth(req, res, 3)) //required general admin
            return;

        let school = new schoolModel(req.body);

        school.save(function (err, result) {
            if (err)
                return res.status(400).json(err);
            return res.json({message: 'success', result: result});
        })
    });

router.route('/school/:id')
    .put((req, res) => {
        if (!auth(req, res, 3)) //required general admin
            return;
        schoolModel.findById(req.params.id, (err, school) => {
            if (err) res.send(err);
            Object.assign(school, req.body).save((err, updateSchool) => {
                if (err) res.send(err);
                res.json({ 'message': 'School Updated', 'data': updateSchool });
            })
        })
    })
    .delete((req, res) => {
        schoolModel.remove({ _id: req.params.id }, (err, removed) => {
            res.json({ 'message': 'School Deleted', 'info': removed });
        })
    });

/*
 * End school API *
                  */

/*
 * Start fee API *
                 */

router.route('/fees')
    .post((req, res) => {
        if (!auth(req, res, 3)) //required general admin
            return;
        let fee = new feeModel(req.body);
        fee.save((err, saved) => {
            res.json({ 'message': 'Add Fees Successfully', 'data': saved });
        })
    });

router.route('/fees/:id')
    .put((req, res) => {
        if (!auth(req, res, 3)) //required general admin
            return;
        feeModel.findById(req.params.id, (err, fee) => {
            if (err) res.send(err);
            Object.assign(fee, req.body).save((err, updateFee) => {
                if (err) res.send(err);
                res.json({ 'message': 'Fee Updated', 'data': updateFee });
            })
        })
    })
    .delete((req, res) => {
        feeModel.remove({ _id: req.params.id }, (err, removed) => {
            res.json({ 'message': 'Fee Deleted', 'info': removed });
        })
    });

router.route('/forms')
    .get((req, res)=>{
        formsModel.findOne({}, (err, result)=>{
            if (err)
                return res.status(400).json(err);
            if (result == null){
                result = new formsModel();
                result.save((err, result)=>{
                    if (err)
                        return res.status(400).json(err);
                    return res.json(result);
                })
            }
            else
                return res.json(result);
        })
    })
    .put((req, res)=>{
        if (!auth(req, res, 2))
            return;
        formsModel.findOne({}, (err, result)=>{
            if (err)
                return res.status(400).json(err);
            result.KhamSucKhoe = req.body.KhamSucKhoe;
            result.ChungMinhTaiChinh = req.body.ChungMinhTaiChinh;
            result.save((err, result)=>{
                if (err)
                    return res.status(400).json(err);
                return res.json(result);
            })
        })
    });

module.exports = router;