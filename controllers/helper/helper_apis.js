"use strict";
let route = require('express').Router();
let schoolModel = require('../../models/DanhSachTruongModel').model;
let feesModel = require('../../models/FeesModel').model;
let userModel = require('../../models/UserModel').model;
let serviceModel = require('../../models/ServiceModel');
let infoModel = require('../../models/ThongTinCaNhanModel').model;
let agencyModel = require('../../models/admin/AgencyInformations');
let auth = require('../../helpers/auth-helper');
let geolib = require('geolib');
let getDistance = require('../../helpers/location-helper.js').getDistance;
let objectHelper = require('../../helpers/object-helper');
let _ = require('lodash');
let config = require('../../config/cloudinary');
let cloudinary = require('cloudinary');
let mapKey = require('../../key/mapKey');
let fs = require('fs');
let path = require('path');
let pdfFiller = require('pdffiller');

const destPDF = path.resolve('file', './result.pdf');

route.get('/schools', function (req, res) {
    schoolModel.find({}, function (err, result) {
        res.json(result);
    })
});

route.get('/school/:id', (req, res) => {
    schoolModel.findOne({_id: req.params.id}, function (err, result) {
        if (err)
            return res.status(400).json(err);
        return res.json(result);
    })
});

route.get('/fees-i20', function (req, res) {
    feesModel.findOne({ Name: "I20" }, function (err, result) {
        if (err)
            return res.status(400).json({ message: err });
        return res.json(result);
    })
});

route.get('/get-language/:lang', function (req, res) {
    let en = require('../../config/locales/en');
    let vi = require('../../config/locales/vi');
    let lang = req.params.lang.toLowerCase();
    if (lang == 'en')
        return res.json(en);
    else if (lang == 'vi')
        return res.json(vi);
    return res.json(vi);
});

route.get('/employee', function (req, res) {
    if (!auth(req, res))
        return;

    userModel.find({ LoaiTaiKhoan: { $gt: 0 } }, '-activeAccountToken -Password -__v -isActive', function (err, result) {
        if (err)
            return res.status(400).json({ message: err });
        else return res.json(result);
    })
});

route.get('/get-distance/:profileID', (req, res) => {
    if (!auth(req, res))
        return;

    serviceModel.findOne({ 'profileID': req.params.profileID })
        .populate('userID', '_id')
        .exec((err, result) => {
            if (err)
                return res.status(400).json({ message: err });
            else {
                infoModel.findOne({ 'UserId': result.userID._id }, 'DiaChi', (err, address) => {
                    agencyModel.find({}, (err, list) => {
                        if (err)
                            return res.status(400).json({ message: err });
                        else {
                            let promises = list.map((item) => {
                                return new Promise((resolve, reject) => {
                                    getDistance(`${address.DiaChi.SoNha}, ${address.DiaChi.ThanhPho}, ${address.DiaChi.QuocGia}`, item.Address)
                                        //getDistance('300 Nguyễn Thị Thập', item.Address)
                                        .then((values) => {
                                            let data = {
                                                'AgencyInfo': item,
                                                'Distance': geolib.getDistance({ latitude: values[0].latitude, longitude: values[0].longitude }, { latitude: values[1].latitude, longitude: values[1].longitude }) * 1.25
                                            };
                                            resolve(data);
                                        });
                                });
                            });

                            Promise.all(promises).then((data) => {
                                res.json(data);
                            });
                        }
                    });
                });
            }
        });
});

route.get('/fill', (req, res) => {
    if (!auth(req, res))
        return;

    config(cloudinary);
    infoModel.findOne({ _id: req.query.info }, (err, user) => {
        let userObject = {};
        userObject.Ho = user.HoTen.Ho;
        userObject.FullName = `${user.HoTen.Ho} ${user.HoTen.ChuLot} ${user.HoTen.Ten}`;
        userObject.Ten = `${user.HoTen.ChuLot} ${user.HoTen.Ten}`;
        userObject.FullAddress = `${user.DiaChi.SoNha} ${user.DiaChi.ThanhPho} ${user.DiaChi.QuocGia}`;
        userObject.Email = user.Email;
        userObject.SoDienThoai = user.SoDienThoai;
        let dob = _.split(user.NgaySinh, '/', 3);
        userObject.day = dob[0];
        userObject.month = dob[1];
        userObject.year = dob[2];
        userObject.NgaySinh = user.NgaySinh;
        userObject.NoiSinh = user.NoiSinh.QuocGia;
        userObject.QuocTich = user.QuocTich;
        userObject.QuocGia = user.DiaChi.QuocGia;
        userObject.ThanhPho = user.DiaChi.ThanhPho;
        userObject.SoNha = user.DiaChi.SoNha;

        schoolModel.findOne({ _id: req.query.school }, (err, school) => {
            let mapData = mapKey[_.findIndex(mapKey, obj => {
                return obj.school_name === school.TenTruong.replace(/ /g, "_").toLowerCase();
            })];

            mapData = _.omit(mapData, ['school_name']);
            let data = _.omit(objectHelper.mapped2Json(mapData, userObject), ['']);
            let filePath = new Promise((resolve, reject) => {
                pdfFiller.fillForm(school.BieuMau, destPDF, data, (err, result) => {
                    if (err) throw err;
                    resolve(destPDF);
                });
            });

            filePath.then(filePath => {
                let stream = cloudinary.uploader.upload_stream((result) => {
                    res.status(200).json({ data: result.url });

                }, { public_id: `${req.query.info}`.replace(/ /g, "_").toLowerCase() });

                let rs = fs.createReadStream(filePath).pipe(stream);
            });
        })
    });


});

route.get('/')

module.exports = route;
